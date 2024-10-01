"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bypassRLS = bypassRLS;
exports.forTenant = forTenant;
const client_1 = require("@prisma/client");
function bypassRLS() {
    return client_1.Prisma.defineExtension((prisma) => prisma.$extends({
        query: {
            $allModels: {
                async $allOperations({ args, query }) {
                    const [, result] = await prisma.$transaction([
                        prisma.$executeRaw `SELECT set_config('app.bypass_rls', 'on', TRUE)`,
                        query(args),
                    ]);
                    return result;
                },
            },
        },
    }));
}
function forTenant(tenantId) {
    return client_1.Prisma.defineExtension((prisma) => prisma.$extends({
        query: {
            $allModels: {
                async $allOperations({ args, query }) {
                    const [, result] = await prisma.$transaction([
                        prisma.$executeRaw `SELECT set_config('app.current_tenant_id', ${tenantId}, FALSE)`,
                        query(args),
                    ]);
                    console.log("Current Tenant ID:", tenantId);
                    return result;
                },
            },
        },
    }));
}
const prisma = new client_1.PrismaClient({
    errorFormat: "pretty",
});
exports.default = prisma;
