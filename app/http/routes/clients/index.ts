import { Router } from 'express';
import { clientController } from '../../controller/ClientController';

const router = Router();

router.get('/clients', clientController.index.bind(clientController));
router.post('/clients', clientController.create.bind(clientController));
router.get('/clients/:id', clientController.show.bind(clientController));
router.put('/clients/:id', clientController.update.bind(clientController));
router.delete('/clients/:id', clientController.delete.bind(clientController));
router.get('/get-client-order/:id', clientController.getClientOrders.bind(clientController))
export default router;
