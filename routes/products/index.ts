import { Router } from 'express';
import prisma, { forTenant, bypassRLS } from '../../app/utils/prismaClient'; // Import prisma and forTenant function
// import { pgMiddleware } from '../../app/http/middlewares/tenantMiddleware'; // Adjust path as necessary
import { Request } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

const router = Router();

// router.use(pgMiddleware); /  / Apply middleware to routes

// Utility to extract the subdomain (store name) from the host
function getSubdomain(req: Request<{}, any, any, ParsedQs, Record<string, any>>) {
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
        const tenant = await prisma.tenant.findFirst({
            where: { name: storeName },
        });

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        // Use Prisma extended with tenant information
        const tenantPrisma = prisma.$extends(forTenant(tenant.id));
        const products = await tenantPrisma.product.findMany();

        res.json(products); // Return products as JSON
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
});

export default router;
