import { NextFunction, Request, Response } from "express";
import { clientService } from "../services/ClientService";

class ClientController {
    async create(req: Request, res: Response, next: NextFunction) {
        const { fullname, email } = req.body.data;
        const tenantPrisma = req.tenantPrisma;
        const tenantId = req.tenantId

        try {
            const client = await clientService.createClient(fullname, email, tenantPrisma, tenantId);
            return res.status(201).json(client);
        } catch (error) {
            next(error);
        }
    }

    async index(req: Request, res: Response, next: NextFunction) {
        const tenantPrisma = req.tenantPrisma;

        try {
            const clients = await clientService.listClients(tenantPrisma);
            return res.status(200).json(clients);
        } catch (error) {
            next(error);
        }
    }

    async show(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const tenantPrisma = req.tenantPrisma;

        try {
            const client = await clientService.getClientById(id, tenantPrisma);
            if (!client) {
                return res.status(404).json({ error: "Client not found" });
            }
            return res.status(200).json(client);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const data = req.body.data;
        const tenantPrisma = req.tenantPrisma;

        try {
            const updatedClient = await clientService.updateClient(id, data, tenantPrisma);
            return res.status(200).json(updatedClient);
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const tenantPrisma = req.tenantPrisma;

        try {
            await clientService.deleteClient(id, tenantPrisma);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async getClientOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const tenantPrisma = req.tenantPrisma
            const clientOrders = await clientService.getClientOrders(id, tenantPrisma)
            return res.status(200).json(clientOrders)
        } catch (error) {
            next(error)
        }
    }
}

export const clientController = new ClientController();
