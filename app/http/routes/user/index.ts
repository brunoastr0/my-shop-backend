import { Router } from 'express';
import { userController } from '../../controller/UserController';


const router = Router();





router.get('/current/user', async (req, res, next) => {
    const currentUser = userController.currentUser.bind(userController)
    currentUser(req, res, next)

})
router.post('/logout', async (req, res, next) => {
    const logout = userController.logout.bind(userController)
    logout(req, res, next)

})


export default router;
