import { Prisma, PrismaClient } from "@prisma/client";

export function bypassRLS() {
    return Prisma.defineExtension((prisma) =>
        prisma.$extends({
            query: {
                $allModels: {
                    async $allOperations({ args, query }) {
                        return await prisma.$transaction(async (tx) => {
                            // Set the RLS bypass within the same transaction
                            await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', TRUE)`;

                            // Execute the original query within the same transaction
                            const result = await query(args);

                            return result;
                        });
                    },
                },
            },
        })
    );
}

export function forTenant(tenantId: string, tenantName: string) {
    return Prisma.defineExtension((prisma) =>
        prisma.$extends({
            query: {
                $allModels: {
                    async $allOperations({ args, query }) {
                        const [, result] = await prisma.$transaction([
                            prisma.$executeRaw`SELECT set_config('app.current_tenant_id', ${tenantId}, FALSE)`,
                            // prisma.$executeRaw`SELECT set_config('app.current_tenant_name', ${tenantName},FALSE)`,

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
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'stdout',
            level: 'error',
        },
        {
            emit: 'stdout',
            level: 'info',
        },
        {
            emit: 'stdout',
            level: 'warn',
        },
    ], errorFormat: "pretty",

});
prisma.$on('query', (e) => {
    console.log('Query: ' + e.query)
    console.log('Params: ' + e.params)
    console.log('Duration: ' + e.duration + 'ms')
})

export default prisma;
