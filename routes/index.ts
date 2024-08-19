// routes/userRoutes.js
import express, { Request, Response } from "express";
const router = express.Router();
import { checkJwt } from '../app/http/middlewares/auth'

router.get('/public', (req: Request, res: Response) => {
    res.send('hello public route')
})

router.get("/protected", checkJwt, (req: Request, res: Response) => {
    res.send({ message: "This is a protected route sir2" });
});
// Export the router to be used in the main app
module.exports = router;
