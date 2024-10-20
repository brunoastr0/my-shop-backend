import { Request, Response, NextFunction } from "express";
import prisma, { forTenant } from "../../utils/prismaClient";


export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const storeName = req.headers["x-tenant-name"] as string; // Assuming tenant name is passed in this header
    if (!storeName) {
        return res.status(400).json({ message: "Tenant name is required in headers." });
    }

    try {
        // Fetch tenant details from the database
        const tenant = await prisma.tenant.findFirst({
            where: { name: storeName },
        });
        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found." });
        }

        // Create tenant-specific Prisma client with RLS applied
        const tenantPrisma = prisma.$extends(forTenant(tenant.id, tenant.name));
        // Attach tenant-specific Prisma client to the request
        req.tenantPrisma = tenantPrisma;

        next();
    } catch (error) {
        console.error("Error in tenantMiddleware:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

