import { Request, Response, NextFunction } from "express";
import prisma, { forTenant } from "../../utils/prismaClient";
import { MissingTenantError, TenantNotFoundError } from "../../utils/error-handler"



// // Extend Express Request interface to add tenantPrisma
// declare module 'express-serve-static-core' {
//     interface Request {
//         tenantPrisma?: typeof prisma; // Add optional tenantPrisma to Request
//     }
// }

export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {



    const storeName = req.headers["x-tenant-name"] as string;
    if (!storeName) {
        // Pass custom error for missing tenant name
        return next(new MissingTenantError());
    }

    try {
        // Fetch tenant details
        const tenant = await prisma.tenant.findFirst({
            where: { name: storeName },
        });

        if (!tenant) {
            // Pass custom error for tenant not found
            return next(new TenantNotFoundError());
        }

        // Apply tenant-specific RLS to Prisma instance and attach it to the request
        req.tenantPrisma = prisma.$extends(forTenant(tenant.id, tenant.name));

        next();
    } catch (error) {
        next(error); // Pass any unexpected errors to the error handler
    }
};
