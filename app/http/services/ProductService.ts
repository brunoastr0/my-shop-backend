
import { PrismaClient } from '@prisma/client'; // Adjust the import based on where your User model is defined
import jwt from 'jsonwebtoken';
// Create a Prisma Client instance


class ProductService {
    // Create a new user
    async create(email: string, password: string, tenantPrisma: PrismaClient) {

    }

    // User login
    async index(tenantPrisma: PrismaClient, token: string) {
        if (!tenantPrisma) {
            throw new Error("Tenant invalid")
        }

        const products = await tenantPrisma.product.findMany();

        return products; // Return products as JSON

    }


    // Additional methods like updateUser, deleteUser, etc. can be added here
}

// Export an instance of UserService
export const productService = new ProductService();
