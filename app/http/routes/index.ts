// routes/userRoutes.js
import express, { Request, Response } from "express";
const router = express.Router();
import { authenticateToken } from '../middlewares/auth'
import user from './user'
import products from './products'
import clients from './clients'
import orders from './orders'

import admin from './admin'
import { tenantMiddleware } from "../middlewares/extractTenantName";
import errorMiddleware from "../middlewares/error-middleware";
// import orders from './orders'


// app.get("/health", async (req, res) => {
//   try {
//     await prisma.$connect(); // Ensure DB connection
//     res.send("Database connected.");
//   } catch (err) {
//     res.status(500).send("Database connection failed.");
//   }
// });
router.use(admin)
router.use(tenantMiddleware)

router.use(user)
//
router.use(authenticateToken)
router.use(products)
router.use(clients)
router.use(orders)
//error-middleware
router.use(errorMiddleware)




// Export the router to be used in the main app
module.exports = router;
