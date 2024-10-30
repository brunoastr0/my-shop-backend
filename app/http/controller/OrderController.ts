import { NextFunction, Request, Response } from "express";
import { orderService } from "../services/OrderService";

class OrderController {
    async create(req: Request, res: Response, next: NextFunction) {
        const { client_id, total_amount } = req.body.data;
        const tenantPrisma = req.tenantPrisma;
        const tenantId = req.tenantId

        try {
            const order = await orderService.createOrder(client_id, total_amount, tenantPrisma, tenantId);
            return res.status(201).json(order);
        } catch (error) {
            next(error);
        }
    }

    async index(req: Request, res: Response, next: NextFunction) {
        const tenantPrisma = req.tenantPrisma;

        try {
            const orders = await orderService.listOrders(tenantPrisma);
            return res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    }

    async show(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const tenantPrisma = req.tenantPrisma;

        try {
            const order = await orderService.getOrderById(id, tenantPrisma);
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            return res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const data = req.body.data;
        const tenantPrisma = req.tenantPrisma;

        try {
            const updatedOrder = await orderService.updateOrder(id, data, tenantPrisma);
            return res.status(200).json(updatedOrder);
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const tenantPrisma = req.tenantPrisma;

        try {
            await orderService.deleteOrder(id, tenantPrisma);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export const orderController = new OrderController();
