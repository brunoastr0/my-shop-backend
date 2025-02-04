// routes/userRoutes.js
import express, { Request, Response } from "express";
const router = express.Router();
import { authenticateToken } from '../middlewares/auth'
import user from './user'
import auth from './auth'

import products from './products'
import clients from './clients'
import orders from './orders'
import flow from './flow'
import admin from './admin'
import webhook from './webhook'
import { tenantMiddleware } from "../middlewares/extractTenantName";
import errorMiddleware from "../middlewares/error-middleware";
import { rawBodyMiddleware } from "../middlewares/rawBodyMiddleware";
// import orders from './orders'


// app.get("/health", async (req, res) => {
//   try {
//     await prisma.$connect(); // Ensure DB connection
//     res.send("Database connected.");
//   } catch (err) {
//     res.status(500).send("Database connection failed.");
//   }
// });


// Whatsapp API integration
router.use(rawBodyMiddleware);
router.use(webhook)
router.use(flow)

//
router.use(admin)
router.use(tenantMiddleware)

router.use(auth)

router.use(authenticateToken)
router.use(user)
router.use(products)
router.use(clients)
router.use(orders)


//error-middleware
router.use(errorMiddleware)




// Export the router to be used in the main app
module.exports = router;
