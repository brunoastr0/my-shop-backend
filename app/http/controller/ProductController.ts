import { Request, Response } from "express";
import { productService } from "../services/ProductService"; // Adjust the import according to your file structure

class ProductController {
    // Create a new user
    async create(req: Request, res: Response) {

        // const { email, password } = req.body.data;
        // const tenantPrisma = req.tenantPrisma;
        // try {
        //     const user = await userService.createUser(email, password, tenantPrisma);
        //     return res.status(201).json({ user });
        // } catch (error: any) {
        //     return res.status(400).json({ message: error.message });
        // }
    }

    async index(req: Request, res: Response) {
        const tenantPrisma = req.tenantPrisma;

        try {
            console.log(tenantPrisma)
            const products = await productService.index(tenantPrisma, "token");
            return res.status(200).json(products);
        } catch (error: any) {
            return res.status(401).json({ message: error.message });
        }
    }


}

export const productController = new ProductController();
