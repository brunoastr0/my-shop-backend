// types/express.d.ts
import { tenants } from '@prisma/client'; // Assuming you're using Prisma for the Tenant model

declare global {
    namespace Express {
        interface Request {
            tenants?: tenants; // Add tenant property to the Request type
        }
    }
}

export { }; // This is necessary to make it a module and avoid global scope issues
