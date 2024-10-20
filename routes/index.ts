// routes/userRoutes.js
import express, { Request, Response } from "express";
const router = express.Router();
import { authenticateToken } from '../app/http/middlewares/auth'
import user from './user'
import products from './products'
import admin from './admin'
import { tenantMiddleware } from "../app/http/middlewares/extractTenantName";
// import orders from './orders'
router.use(admin)
router.use(tenantMiddleware)
router.use(user)
router.use(authenticateToken)
router.use(products)




// Export the router to be used in the main app
module.exports = router;
