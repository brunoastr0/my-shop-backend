import { Request, Response } from "express";
import { userService } from "../services/UserService"; // Adjust the import according to your file structure

class UserController {
    // Create a new user
    async createUser(req: Request, res: Response) {

        const { email, password } = req.body.data;
        const tenantPrisma = req.tenantPrisma;
        try {
            const user = await userService.createUser(email, password, tenantPrisma);
            return res.status(201).json({ user });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    // User login
    async login(req: Request, res: Response) {
        const { email, password } = req.body.data;
        const tenantPrisma = req.tenantPrisma;

        try {
            const { accessToken, refreshToken } = await userService.login(email, password, tenantPrisma);
            return res.status(200).json({ accessToken, refreshToken });
        } catch (error: any) {
            return res.status(401).json({ message: error.message });
        }
    }


}

export const userController = new UserController();
