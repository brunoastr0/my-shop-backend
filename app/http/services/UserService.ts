import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'; // Adjust the import based on where your User model is defined

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
    async createUser(email: string, password: string, tenantPrisma: PrismaClient) {
        try {
            if (!tenantPrisma) {
                throw new Error("Tenant invalid")
            }
            const existingUser = await tenantPrisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                throw new Error("Email already in use.");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("eere")

            const createdUser = await tenantPrisma.user.create({
                data: {
                    id: crypto.randomUUID(),
                    email,
                    password: hashedPassword,
                },
            });


            return createdUser;
        } catch (error) {
            console.log(error)
            throw new Error("Failed to create user")
        }
    }

    // User login
    async login(email: string, password: string, tenantPrisma: PrismaClient): Promise<{ accessToken: string; refreshToken: string; }> {

        if (!tenantPrisma) {
            throw new Error("Tenant invalid")
        }

        const user = await tenantPrisma.user.findUnique({
            where: { email },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error("Invalid email or password.");
        }

        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

        await tenantPrisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        return { accessToken, refreshToken };
    }
    // Generate access token
    private generateAccessToken(user: { id: string; email: string }) {
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET! || "password"

        return jwt.sign(
            { id: user.id, email: user.email },
            accessTokenSecret,
            { expiresIn: "15m" }
        );
    }

    // Generate refresh token
    private generateRefreshToken(user: { id: string }) {
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET! || "password"
        return jwt.sign({ id: user.id }, refreshTokenSecret, {
            expiresIn: "15d",
        });
    }

    // Additional methods like updateUser, deleteUser, etc. can be added here
}

// Export an instance of UserService
export const userService = new UserService();
