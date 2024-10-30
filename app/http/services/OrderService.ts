import { PrismaClient, Order } from '@prisma/client';
import { MissingTenantError } from '../../utils/error-handler';

class OrderService {
    async createOrder(clientId: string, totalAmount: number, tenantPrisma: PrismaClient, tenant_id: string): Promise<Order> {
        if (!tenantPrisma) throw new MissingTenantError();

        return await tenantPrisma.order.create({
            data: {
                client_id: clientId,
                total_amount: totalAmount,
                status: "pending",
                tenant_id,
            },
        });
    }

    async listOrders(tenantPrisma: PrismaClient): Promise<Order[]> {
        if (!tenantPrisma) throw new MissingTenantError();

        return await tenantPrisma.order.findMany();
    }

    async getOrderById(id: string, tenantPrisma: PrismaClient): Promise<Order | null> {
        if (!tenantPrisma) throw new MissingTenantError();

        return await tenantPrisma.order.findUnique({
            where: { id },
        });
    }

    async updateOrder(id: string, data: Partial<Order>, tenantPrisma: PrismaClient): Promise<Order> {
        if (!tenantPrisma) throw new MissingTenantError();

        return await tenantPrisma.order.update({
            where: { id },
            data,
        });
    }

    async deleteOrder(id: string, tenantPrisma: PrismaClient): Promise<void> {
        if (!tenantPrisma) throw new MissingTenantError();

        await tenantPrisma.order.delete({
            where: { id },
        });
    }
}

export const orderService = new OrderService();
