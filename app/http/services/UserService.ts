import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma, { forTenant } from "../../utils/prismaClient";

// Create a Prisma Client instance

interface User {
    id: string; // ID is a string for UUID
    first_name?: string | null; // Optional fields
    last_name?: string | null;
    email: string;
    active: boolean;
    refreshToken?: string | null; // Optional field for refresh token
    password: string; // Password will not be stored in the User interface after creation
    tenant_id: string; // The tenant ID as a string
    created_at: Date; // Created at timestamp
    updated_at: Date; // Updated at timestamp
}

class UserService {
    // Create a new user
    async createUser(email: string, password: string, store_name: string) {
        try {


            const tenant = await prisma.tenant.findFirst({
                where: { name: store_name },
            });
            if (!tenant) {
                throw new Error("Tenant invalid")
            }
            const tenantPrisma = prisma.$extends(forTenant(tenant.id));
            const existingUser = await tenantPrisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                throw new Error("Email already in use.");
            }
            const hashedPassword = bcrypt.hashSync(password, 10);

            const createdUser = await prisma.user.create({
                data: {
                    id: "713c83fa-7015-47bc-8413-041ed2b38e33",
                    email,
                    password: hashedPassword,
                },
            });


            return createdUser;
        } catch (error) {
            console.log(error)
        }
    }

    // User login
    async login(email: string, password: string, store_name: string): Promise<{ accessToken: string; refreshToken: string; }> {

        const tenant = await prisma.tenant.findFirst({
            where: { name: store_name },
        });
        if (!tenant) {
            throw new Error("Tenant invalid")
        }
        const tenantPrisma = prisma.$extends(forTenant(tenant.id));


        const user = await tenantPrisma.user.findUnique({
            where: { email },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error("Invalid email or password.");
        }

        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        return { accessToken, refreshToken };
    }

    // Generate access token
    private generateAccessToken(user: { id: string; email: string }) {
        return jwt.sign(
            { id: user.id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "15m" }
        );
    }

    // Generate refresh token
    private generateRefreshToken(user: { id: string }) {
        return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET!, {
            expiresIn: "15d",
        });
    }

    // Additional methods like updateUser, deleteUser, etc. can be added here
}

// Export an instance of UserService
export const userService = new UserService();
