
import { Prisma } from '@prisma/client'; // Adjust the import based on where your User model is defined
import { JwtPayload, Secret } from "jsonwebtoken";

declare global {
    namespace Express {
        interface CustomJwtPayload extends JwtPayload {
            id: string;
            tenantId: string;
            email: string;
        }
        interface Request {
            user?: string | CustomJwtPayload | any; // Extend with user property
            tenantPrisma: Prisma;
            tenantId: string;
        }
        interface ProcessEnv {
            ACCESS_TOKEN_SECRET: string | Secret;
            REFRESH_TOKEN_SECRET: string | Secret;
        }
    }
    declare module "express-serve-static-core" {
        interface Request {
            rawBody?: string;
        }
    }
}


