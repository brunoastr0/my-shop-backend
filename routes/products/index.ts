import { Router } from 'express';
import { productController } from '../../app/http/controller/ProductController';

const router = Router();

// GET /products - List all products for the current tenant
router.get('/get-products', productController.index.bind(productController));

// POST /products - Create a new product
router.post('/create-product', productController.create.bind(productController));

// GET /products/:id - Retrieve a specific product by ID
router.get('/get-product/:id', productController.show.bind(productController));

// PUT /products/:id - Update a product by ID
router.put('/update-product/:id', productController.update.bind(productController));

// DELETE /products/:id - Delete a product by ID
router.delete('/delete-product/:id', productController.delete.bind(productController));

export default router;
