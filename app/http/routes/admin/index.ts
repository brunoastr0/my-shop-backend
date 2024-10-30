import { Router } from 'express';
import { tenantController } from '../../controller/TenantController';


const router = Router();





router.post('/create-tenant', async (req, res, next) => {
    try {

        const createTenant = tenantController.createTenant.bind(tenantController)
        createTenant(req, res, next)

    } catch (error) {
        console.log(error)
    }

});





export default router;
