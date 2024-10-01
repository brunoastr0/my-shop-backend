
import { User } from '@prisma/client'; // Adjust the import based on where your User model is defined
import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload; // Extend with user property
        }
    }
}


