
import { Prisma } from '@prisma/client'; // Adjust the import based on where your User model is defined
import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface CustomJwtPayload extends JwtPayload {
            id: string;
            tenantId: string;
            email: string;
        }
        interface Request {
            user?: string | CustomJwtPayload; // Extend with user property
            tenantPrisma: Prisma;
        }
    }
}


