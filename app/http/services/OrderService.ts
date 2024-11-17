import { PrismaClient, Order } from '@prisma/client';
import { MissingTenantError } from '../../utils/error-handler';

class OrderService {
    async createOrder(clientId: string, due_date: Date, items: { productId: string; quantity: number }[], tenantPrisma: PrismaClient, tenant_id: string): Promise<Order> {
        if (!tenantPrisma) throw new MissingTenantError();



        // Fetch the product prices from the database
        const productIds = items.map(item => item.productId);
        const products = await tenantPrisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, sale_price: true },
        });

        // Map product prices for easy lookup
        const productPriceMap = products.reduce((map, product) => {
            map[product.id] = product.sale_price;
            return map;
        }, {} as Record<string, number>);

        // Calculate total amount and prepare order items
        const orderItems = items.map(item => {
            const price = productPriceMap[item.productId];
            if (price === undefined) throw new Error(`Product with ID ${item.productId} not found.`);
            return {
                product_id: item.productId,
                quantity: item.quantity,
                price: price,
            };
        });

        const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Create the order with order items
        const order = await tenantPrisma.order.create({
            data: {
                client_id: clientId,
                total_amount: totalAmount,
                due_date,

                tenant_id,
                items: {
                    create: orderItems.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.price,
                        tenant_id
                    })),
                },
            },
            include: { items: true },
        });

        return order;

    }

    async listOrders(tenantPrisma: PrismaClient): Promise<Order[]> {
        if (!tenantPrisma) throw new MissingTenantError();

        return await tenantPrisma.order.findMany({
            include: {
                items: true,
            },
        });
    }

    async getOrderById(id: string, tenantPrisma: PrismaClient): Promise<Order | null> {
        if (!tenantPrisma) throw new MissingTenantError();

        return await tenantPrisma.order.findUnique({
            where: { id },
            include: {
                items: true,
            }
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
