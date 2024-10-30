import { Router } from 'express';
import { orderController } from '../../controller/OrderController';

const router = Router();

router.get('/orders', orderController.index.bind(orderController));
router.post('/orders', orderController.create.bind(orderController));
router.get('/orders/:id', orderController.show.bind(orderController));
router.put('/orders/:id', orderController.update.bind(orderController));
router.delete('/orders/:id', orderController.delete.bind(orderController));

export default router;
