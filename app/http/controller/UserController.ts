import { Request, Response } from "express";
import { userService } from "../services/UserService"; // Adjust the import according to your file structure

class UserController {
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
    async login(req: Request, res: Response) {
        const { email, password } = req.body.data;
        const tenantPrisma = req.tenantPrisma;
        // console.log(await tenantPrisma.user.findMany())

        try {
            const { accessToken, refreshToken } = await userService.login(email, password, tenantPrisma);
            return res.status(200).json({ accessToken, refreshToken });
        } catch (error: any) {
            return res.status(401).json({ message: error.message });
        }
    }

    async createTenant(req: Request, res: Response) {
        try {
            const { tenantName, adminEmail, adminPassword } = req.body
            const { tenant } = await userService.createTenantAndAdmin(tenantName, adminEmail, adminPassword)

            return res.status(201).json({ tenant })
        } catch (error: any) {
            return res.status(400).json({ message: error.message })

        }
    }


}

export const userController = new UserController();
