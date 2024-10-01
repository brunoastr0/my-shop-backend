"use strict";
// import { Request, Response, NextFunction } from 'express';
// import PrismaClientWrapper from '../../utils/PostgresClient'; // Adjust path as necessary
// const prismaClientWrapper = new PrismaClientWrapper();
// export const pgMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // Extract tenant name from request
//         const store_name = req.hostname.split('.')[0]; // Adjust based on your domain structure
//         // Get tenant information
//         const tenant = await prismaClientWrapper.transaction(store_name);
//         // Attach tenant information to request object
//         req.tenants = tenant;
//         next();
//     } catch (error) {
//         console.error('Error in pgMiddleware:', error);
//         res.status(500).json({ error: 'Database error' });
//     }
// };
