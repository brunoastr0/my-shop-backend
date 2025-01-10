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

class UserService {
    ACCESS_TOKEN_SECRET: any;
    constructor() {
        this.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
    }

    async currentUser(tenantPrisma: PrismaClient, authorization: any): Promise<any> {
        if (!tenantPrisma) {
            throw new Error("Tenant invalid")
        }
        if (!authorization) {
            throw new Error("accessToken not provided");
        }
        authorization = authorization.split(" ")[1]
        const decoded = jwt.verify(authorization, this.ACCESS_TOKEN_SECRET) as { user: any };
        const user = await tenantPrisma.user.findUnique({
            // @ts-ignore
            where: { id: decoded.id },
            select: { id: true, first_name: true, last_name: true, email: true, role: true, tenant_id: true }
        })
        return user


    }

    async logout(tenantPrisma: PrismaClient, authorization: any): Promise<any> {
        if (!tenantPrisma) {
            throw new Error("Tenant invalid")
        }
        if (!authorization) {
            throw new Error("accessToken not provided");
        }
        authorization = authorization.split(" ")[1]
        const decoded = jwt.verify(authorization, this.ACCESS_TOKEN_SECRET) as { user: any };
        await tenantPrisma.user.update({
            // @ts-ignore
            where: { id: decoded.id },
            data: { refreshToken: null }
        })
        return;
    }

}

// Export an instance of UserService
export const userService = new UserService();
