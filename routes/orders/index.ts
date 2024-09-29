// import express, { Request, Response } from 'express';
// import prisma from '../../app/utils/prismaClient';  // Assuming prismaClient is your Prisma instance
// const router = express.Router();
// // Get all orders for the current tenant
// router.get('/', async (req, res) => {
//     try {
//         const { tenants } = req;

//         if (!tenants) {
//             return res.status(400).json({ error: 'Tenant information missing.' });
//         }

//         const orders = await prisma.orders.findMany({
//             where: {
//                 tenant_id: tenants.id,
//             },
//             include: {
//                 order_items: true, // Assuming you want to include related items
//             },
//         });

//         res.json(orders);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error fetching orders.' });
//     }
// });

// // Create a new order for the current tenant
// router.post('/', async (req, res) => {
//     try {
//         const { tenants } = req
//         if (!tenants) {
//             return res.status(400).json({ error: 'Tenant information missing.' });
//         }

//         const { client_id, total_amount, order_items } = req.body;

//         // Create new order
//         const newOrder = await prisma.orders.create({
//             data: {
//                 tenant_id: tenants.id,
//                 client_id,
//                 total_amount,
//                 order_items: {
//                     create: order_items,  // Assuming order_items is an array
//                 },
//                 status,
//             },
//         });

//         res.status(201).json(newOrder);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error creating order.' });
//     }
// });

// export default router;
