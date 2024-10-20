import { Router } from 'express';
import { userController } from '../../app/http/controller/UserController';


const router = Router();





router.post('/create-tenant', async (req, res) => {
    try {

        const createTenant = userController.createTenant.bind(userController)
        createTenant(req, res)

    } catch (error) {
        console.log(error)
    }

});





export default router;
