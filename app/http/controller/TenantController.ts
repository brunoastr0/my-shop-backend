import { Request, Response } from "express";
import { tenantService } from "../services/TenantService";

class TenantController {

    async createTenant(req: Request, res: Response) {
        try {
            const { tenantName, adminEmail, adminPassword } = req.body
            const { tenant, adminUser } = await tenantService.createTenantAndAdmin(tenantName, adminEmail, adminPassword)

            return res.status(201).json({ tenant, adminUser })
        } catch (error: any) {
            return res.status(400).json({ message: error })

        }
    }


}

export const tenantController = new TenantController();
