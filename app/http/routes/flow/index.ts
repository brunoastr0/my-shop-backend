import { Router } from 'express';
import { FlowController } from '../../controller/FlowController';

const router = Router();

router.post("/flow", FlowController.handleFlowRequest.bind(FlowController))

export default router;