import { Request, Response, NextFunction } from "express";

export const VerifyTenantAccess = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;  // Assuming user is attached from the JWT middleware
    const tenant = req.tenantPrisma;

    // Check if the authenticated user belongs to the correct tenant
    if (user?.tenantId !== tenant.id) {
        return res.status(403).send('Forbidden: Access to this tenant’s data is not allowed');
    }

    next();
}
