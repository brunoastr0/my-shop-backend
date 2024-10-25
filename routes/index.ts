// routes/userRoutes.js
import express, { Request, Response } from "express";
const router = express.Router();
import { authenticateToken } from '../app/http/middlewares/auth'
import user from './user'
import products from './products'
import admin from './admin'
import { tenantMiddleware } from "../app/http/middlewares/extractTenantName";
import errorMiddleware from "../app/http/middlewares/error-middleware";
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

//error-middleware
router.use(errorMiddleware)




// Export the router to be used in the main app
module.exports = router;
