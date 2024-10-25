import { NextFunction, Request, Response } from "express";
import { tenantService } from "../services/TenantService";
import { Prisma } from "@prisma/client";

class TenantController {

    async createTenant(req: Request, res: Response, next: NextFunction) {
        try {
            const { tenantName, adminEmail, adminPassword } = req.body
            const { tenant, adminUser } = await tenantService.createTenantAndAdmin(tenantName, adminEmail, adminPassword)

            return res.status(201).json({ tenant, adminUser })
        } catch (error: unknown) {
            next(error)
            // res.status(400).json({ message: error instanceof Prisma.PrismaClientKnownRequestError })

        }
    }


}

export const tenantController = new TenantController();
