"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prismaClient_1 = __importStar(require("../../app/utils/prismaClient")); // Import prisma and forTenant function
const router = (0, express_1.Router)();
// router.use(pgMiddleware); /  / Apply middleware to routes
// Utility to extract the subdomain (store name) from the host
function getSubdomain(req) {
    const host = req.headers.host;
    const subdomain = host?.split('.')[0]; // Extracts 'store1' from 'store1.domain.com'
    return subdomain;
}
// GET /products - Fetch products for the current tenant based on subdomain
router.get('/products', async (req, res) => {
    try {
        const storeName = getSubdomain(req); // Get the store name from the subdomain
        if (!storeName) {
            return res.status(400).json({ error: 'Invalid store name in URL' });
        }
        // // Query the tenant by the store name
        const tenant = await prismaClient_1.default.tenant.findFirst({
            where: { name: storeName },
        });
        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }
        // Use Prisma extended with tenant information
        const tenantPrisma = prismaClient_1.default.$extends((0, prismaClient_1.forTenant)(tenant.id));
        const products = await tenantPrisma.product.findMany();
        res.json(products); // Return products as JSON
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
});
exports.default = router;
