
import { PrismaClient, Product } from '@prisma/client'; // Adjust the import based on where your User model is defined
import jwt from 'jsonwebtoken';
import { MissingTenantError, TenantNotFoundError } from '../../utils/error-handler';
// Create a Prisma Client instance


class ProductService {
    // Create a new product
    async createProduct(name: string, price: number, description: string, tenantPrisma: PrismaClient): Promise<Product> {
        if (!tenantPrisma) throw new TenantNotFoundError();

        const product = await tenantPrisma.product.create({
            data: {
                product_name: name,
                sale_price: price,
                product_description: description
            },
        });

        return product;
    }

    // List all products
    async listProducts(tenantPrisma: PrismaClient): Promise<Product[]> {
        if (!tenantPrisma) throw new MissingTenantError();

        const products = await tenantPrisma.product.findMany();
        return products;
    }

    // Update a product by ID
    async updateProduct(id: string, name: string, price: number, tenantPrisma: PrismaClient): Promise<Product> {
        if (!tenantPrisma) throw new MissingTenantError();

        const updatedProduct = await tenantPrisma.product.update({
            where: { id },
            data: { product_name: name, sale_price: price },
        });

        return updatedProduct;
    }

    // Delete a product by ID
    async deleteProduct(id: string, tenantPrisma: PrismaClient): Promise<void> {
        if (!tenantPrisma) throw new MissingTenantError();

        await tenantPrisma.product.delete({
            where: { id },
        });
    }

    // View a single product by ID
    async getProductById(id: string, tenantPrisma: PrismaClient): Promise<Product | null> {
        if (!tenantPrisma) throw new MissingTenantError();

        const product = await tenantPrisma.product.findUnique({
            where: { id },
        });

        return product;
    }

    // JWT Authentication helper method (if you need to issue tokens for product-related actions)
    generateToken(payload: object, secret: string): string {
        return jwt.sign(payload, secret, { expiresIn: '1h' });
    }
}

// Export an instance of ProductService
export const productService = new ProductService();
