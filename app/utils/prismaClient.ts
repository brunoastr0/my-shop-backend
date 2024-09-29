import { Prisma, PrismaClient } from "@prisma/client";

export function bypassRLS() {
    return Prisma.defineExtension((prisma) =>
        prisma.$extends({
            query: {
                $allModels: {
                    async $allOperations({ args, query }) {
                        const [, result] = await prisma.$transaction([
                            prisma.$executeRaw`SELECT set_config('app.bypass_rls', 'on', TRUE)`,
                            query(args),
                        ]);
                        return result;
                    },
                },
            },
        })
    );
}

export function forTenant(tenantId: String) {
    return Prisma.defineExtension((prisma) =>
        prisma.$extends({
            query: {
                $allModels: {
                    async $allOperations({ args, query }) {
                        const [, result] = await prisma.$transaction([
                            prisma.$executeRaw`SELECT set_config('app.current_tenant_id', ${tenantId}, FALSE)`,
                            query(args),
                        ]);
                        console.log("Current Tenant ID:", tenantId);


                        return result;
                    },
                },
            },
        })
    );
}

const prisma = new PrismaClient({
    errorFormat: "pretty",
});

export default prisma;
