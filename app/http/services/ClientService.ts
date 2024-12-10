import { PrismaClient, Client, Order } from '@prisma/client';
import { MissingTenantError } from '../../utils/error-handler';

class ClientService {
    async createClient(fullname: string, email: string, tenantPrisma: PrismaClient, tenantId: string): Promise<Client> {
        if (!tenantPrisma) throw new MissingTenantError();

        const client = await tenantPrisma.client.create({
            data: {
                fullname,
                email,
                phone_number: null,
                address: null,
                tenant_id: tenantId
            },
        });

        return client;
    }

    async listClients(tenantPrisma: PrismaClient): Promise<Client[]> {
        if (!tenantPrisma) throw new MissingTenantError();

        return await tenantPrisma.client.findMany();
    }

    async getClientById(id: string, tenantPrisma: PrismaClient): Promise<Client | null> {
        if (!tenantPrisma) throw new MissingTenantError();

        return await tenantPrisma.client.findUnique({
            where: { id },
        });
    }

    async updateClient(id: string, data: Partial<Client>, tenantPrisma: PrismaClient): Promise<Client> {
        if (!tenantPrisma) throw new MissingTenantError();

        return await tenantPrisma.client.update({
            where: { id },
            data,
        });
    }

    async deleteClient(id: string, tenantPrisma: PrismaClient): Promise<void> {
        if (!tenantPrisma) throw new MissingTenantError();

        await tenantPrisma.client.delete({
            where: { id },
        });
    }

    async getClientOrders(client_id: string, tenantPrisma: PrismaClient): Promise<Order[] | null> {
        if (!tenantPrisma) throw new MissingTenantError();
        return await tenantPrisma.order.findMany({
            where: {
                client_id
            },
            include: { items: true }
        })
    }
}

export const clientService = new ClientService();
