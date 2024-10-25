import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import prisma from "../../utils/prismaClient";
import { AccessTokenMissing, InvalidToken, ForbiddenAccessTenant, TenantNotFoundError } from "../../utils/error-handler"
interface CustomJwtPayload extends JwtPayload {
    id: string;
    tenantId: string;
    email: string;
}


export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const tenantName = req.headers["x-tenant-name"] as string;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return next(new AccessTokenMissing());
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, async (err, decoded) => {
        if (err || !decoded) {
            return next(new InvalidToken());
        }

        // Assert that `decoded` is of type `CustomJwtPayload`
        const user = decoded as CustomJwtPayload;

        const tenant = await prisma.tenant.findFirst({
            where: { name: tenantName },
        });

        if (!tenant) {
            next(new TenantNotFoundError())
            return;
            // return res.status(404).json({ message: "Tenant not found" });
        }

        if (user.tenantId !== tenant.id) {
            next(new ForbiddenAccessTenant())
            // return res.status(403).json({ message: "Access forbidden: Tenant mismatch" });
        }

        req.user = user;  // Attach user info to the request
        next();
    });
};
