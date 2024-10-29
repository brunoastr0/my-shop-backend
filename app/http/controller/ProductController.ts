import { NextFunction, Request, Response } from "express";
import { productService } from "../services/ProductService";

class ProductController {
    // Create a new product
    async create(req: Request, res: Response, next: NextFunction) {
        const { name, price, description } = req.body.data;
        const tenantPrisma = req.tenantPrisma;
        const tenantId = req.tenantId;

        try {
            const result = await productService.createProduct(name, price, description, tenantPrisma, tenantId);
            return res.status(201).json({ result });
        } catch (error: any) {
            return next(error);
        }
    }

    // List all products
    async index(req: Request, res: Response, next: NextFunction) {
        const tenantPrisma = req.tenantPrisma;

        try {
            const products = await productService.listProducts(tenantPrisma);
            return res.status(200).json(products);
        } catch (error: any) {
            return next(error);
        }
    }

    // View single product details by ID
    async show(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const tenantPrisma = req.tenantPrisma;

        try {
            const product = await productService.getProductById(id, tenantPrisma);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            return res.status(200).json(product);
        } catch (error: any) {
            return next(error);
        }
    }

    // Update product details by ID
    async update(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, price } = req.body.data;
        const tenantPrisma = req.tenantPrisma;

        try {
            const updatedProduct = await productService.updateProduct(id, name, price, tenantPrisma);
            return res.status(200).json(updatedProduct);
        } catch (error: any) {
            return next(error);
        }
    }

    // Delete product by ID
    async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const tenantPrisma = req.tenantPrisma;

        try {
            await productService.deleteProduct(id, tenantPrisma);
            return res.status(204).send();
        } catch (error: any) {
            return next(error);
        }
    }
}

export const productController = new ProductController();
