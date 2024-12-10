import { NextFunction, Request, Response } from "express";
import { authService } from "../services/AuthService"; // Adjust the import according to your file structure

class AuthController {
    // Create a new user
    async createUser(req: Request, res: Response) {

        // const { email, password } = req.body.data;
        // try {
        //     const user = await userService.createUser(email, password);
        //     return res.status(201).json({ user });
        // } catch (error: any) {
        //     return res.status(400).json({ message: error.message });
        // }
    }

    // User login
    async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        const tenantPrisma = req.tenantPrisma;
        // console.log(await tenantPrisma.user.findMany())

        try {
            const { accessToken, refreshToken } = await authService.login(email, password, tenantPrisma);
            return res.status(200).json({ accessToken, refreshToken });
        } catch (error: any) {
            next(error);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        const { refreshToken } = req.body;
        const tenantPrisma = req.tenantPrisma;
        try {
            const { accessToken } = await authService.refreshToken(refreshToken, tenantPrisma);
            return res.status(201).json({ accessToken });
        } catch (error: any) {
            next(error);
        }
    }




}

export const authController = new AuthController();
