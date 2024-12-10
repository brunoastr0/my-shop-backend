import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'; // Adjust the import based on where your User model is defined
import prisma, { bypassRLS } from "../../utils/prismaClient";
import { error } from "console";
import { decode } from "punycode";

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

class AuthService {
    prisma;
    constructor() {
        this.prisma = prisma.$extends(bypassRLS()); // Use bypassRLS by default for this instance
    }

    // Create a new user
    async createUser(email: string, password: string) {
        try {

            const existingUser = await this.prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                throw new Error("Email already in use.");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const createdUser = await this.prisma.user.create({
                data: {
                    id: crypto.randomUUID(),
                    email,
                    password: hashedPassword,
                },
            });


            return createdUser;
        } catch (error) {
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
        // if (user) {
        //     throw new Error("error: " + JSON.stringify(user, null, 2))
        // }


        // console.log(await tenantPrisma.user.findMany())
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




    async refreshToken(refreshToken: string, tenantPrisma: PrismaClient): Promise<{ accessToken: string }> {
        if (!refreshToken) {
            throw new Error("refreshToken not provided");
        }

        const user = await tenantPrisma.user.findFirst({
            where: { refreshToken }
        })

        if (!user) {
            throw new Error("Invalid refreshToken.");

        }
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
        // @ts-ignore
        const result = jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
            if (err) {
                throw new Error("Invalid refreshToken.");
            }

        })

        const accessToken = this.generateAccessToken(user);
        return { accessToken }

    }
    // Generate access token
    private generateAccessToken(user: { id: string; email: string; tenant_id: string }) {
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET! || "e8d2b471de7e3b67c183cf027c001488e6783d97c838c573d7cf94b006847496e0502600be828196402b7a542abffedf1dba109eaa6a87ba6f9a29de885fbb9b"

        return jwt.sign(
            {
                id: user.id, tenantId: user.tenant_id,  // Include tenant ID in the payload
                email: user.email
            },
            accessTokenSecret,
            { expiresIn: "15m" }
        );
    }

    // Generate refresh token
    private generateRefreshToken(user: { id: string; tenant_id: string }) {
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET! || "91f75649fe673f757f59715373825126a58bc64b3d0165fe61bb8d1af3a301590a2317c1e72fccfd40e4335df4a5838686ab09ebcd37a2c13e9fc3b8dbfc99db"
        return jwt.sign({ id: user.id, tenandId: user.tenant_id }, refreshTokenSecret, {
            expiresIn: "15d",
        });
    }

    // Additional methods like updateUser, deleteUser, etc. can be added here
}

// Export an instance of UserService
export const authService = new AuthService();
