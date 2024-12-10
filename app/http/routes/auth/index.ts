import { Router } from 'express';
import { authController } from '../../controller/AuthController';


const router = Router();







// GET /products - Fetch products for the current tenant based on subdomain
router.post('/register', async (req, res, next) => {
    try {

        const createUser = authController.createUser.bind(authController)
        createUser(req, res)

    } catch (error) {
        console.log(error)
    }

});

router.post('/login', async (req, res, next) => {
    try {
        const loginUser = authController.login.bind(authController)
        loginUser(req, res, next)

    } catch (error) {
        console.log(error)
    }

});

router.post('/refresh', async (req, res, next) => {
    const refreshToken = authController.refreshToken.bind(authController)
    refreshToken(req, res, next)

})



export default router;
