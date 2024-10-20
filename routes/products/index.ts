import { Router } from 'express';
import { productController } from '../../app/http/controller/ProductController';

const router = Router();


// GET /products - Fetch products for the current tenant based on subdomain
router.get('/products', async (req, res) => {
    try {

        const fetchProducts = productController.index.bind(productController)
        fetchProducts(req, res)

    } catch (error) {
        console.log(error)
    }
});

export default router;
