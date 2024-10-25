import { NextFunction, Request, Response } from "express";
import { productService } from "../services/ProductService"; // Adjust the import according to your file structure

class ProductController {
    // Create a new user
    async create(req: Request, res: Response, next: NextFunction) {

        const { name, price, description } = req.body.data;
        const tenantPrisma = req.tenantPrisma;
        try {
            const result = await productService.createProduct(name, price, description, tenantPrisma);
            return res.status(201).json({ result });
        } catch (error: any) {
            return next(error)
        }
    }

    async index(req: Request, res: Response, next: NextFunction) {
        const tenantPrisma = req.tenantPrisma;

        try {
            const products = await productService.listProducts(tenantPrisma);
            return res.status(200).json(products);
        } catch (error: any) {
            return next(error)
        }
    }


}

export const productController = new ProductController();
