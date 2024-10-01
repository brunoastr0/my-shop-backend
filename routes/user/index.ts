import { Router } from 'express';
import { userController } from '../../app/http/controller/UserController';


const router = Router();


// GET /products - Fetch products for the current tenant based on subdomain
router.post('/register', async (req, res) => {
    try {

        const createUser = userController.createUser.bind(userController)
        createUser(req, res)

    } catch (error) {
        console.log(error)
    }

});

router.post('/login', async (req, res) => {
    try {
        const loginUser = userController.login.bind(userController)
        loginUser(req, res)

    } catch (error) {
        console.log(error)
    }

});


export default router;
