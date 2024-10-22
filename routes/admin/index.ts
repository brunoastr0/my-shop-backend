import { Router } from 'express';
import { tenantController } from '../../app/http/controller/TenantController';


const router = Router();





router.post('/create-tenant', async (req, res) => {
    try {

        const createTenant = tenantController.createTenant.bind(tenantController)
        createTenant(req, res)

    } catch (error) {
        console.log(error)
    }

});





export default router;
