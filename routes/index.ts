// routes/userRoutes.js
import express, { Request, Response } from "express";
const router = express.Router();
import { authenticateToken } from '../app/http/middlewares/auth'
import user from './user'
import products from './products'
// import orders from './orders'
router.use(user)
router.use(authenticateToken, products)


router.get("/protected", authenticateToken, (req: Request, res: Response) => {
    res.send({ message: "This is a protected route sir2" });
});
// Export the router to be used in the main app
module.exports = router;
