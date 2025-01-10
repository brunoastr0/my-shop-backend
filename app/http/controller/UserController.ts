import { NextFunction, Request, Response } from "express";
import { userService } from "../services/UserService"; // Adjust the import according to your file structure

class UserController {



    async currentUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { authorization } = req.headers
            const tenantPrisma = req.tenantPrisma;
            const user = await userService.currentUser(tenantPrisma, authorization);

            return res.status(200).json({ user });
        } catch (error: any) {
            next(error)
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        const tenantPrisma = req.tenantPrisma;

        try {
            const { authorization } = req.headers

            await userService.logout(tenantPrisma, authorization);
            return res.status(200).json({});
        } catch (error: any) {
            next(error);
        }
    }


}

export const userController = new UserController();
