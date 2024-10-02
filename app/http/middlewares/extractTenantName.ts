import { Request, Response, NextFunction } from "express";
import prisma, { forTenant } from "../../utils/prismaClient";

// Middleware to extract tenant ID from headers
export const extractTenantName = async (req: Request, res: Response, next: NextFunction) => {
    const tenantName = req.headers['x-tenant-name']; // Custom header for tenant ID

    if (!tenantName) {
        return res.status(400).json({ message: "Tenant name is missing from headers." });
    }

    // You can perform additional validation here if needed
    // Attach tenantId to the request object
    const tenant = await prisma.tenant.findFirst({
        where: { name: tenantName as string },
    });
    if (!tenant) {
        throw new Error("Tenant invalid")
    }
    req.tenantPrisma = prisma.$extends(forTenant(tenant.id));


    next(); // Proceed to the next middleware or route handler
};
