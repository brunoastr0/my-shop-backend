import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export default class PrismaClientWrapper {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = prisma;
    }

    public transaction = async (store_name: string | undefined) => {
        // Start a transaction
        const result = await this.prisma.$transaction(async (prisma) => {
            // Set tenant name session
            const tenant = await prisma.tenants.findUnique({
                where: { store_name },
            });

            if (tenant) {
                // Set tenant ID for subsequent queries
                await prisma.$executeRaw`SET app.current_tenant_name = ${store_name}`;
                await prisma.$executeRaw`SET app.current_tenant_id = ${tenant.id}`;

                // Return tenant information
                return tenant;
            }

            throw new Error('Tenant not found');
        });

        return result;
    };
}
