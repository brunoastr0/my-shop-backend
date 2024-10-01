"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/userRoutes.js
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../app/http/middlewares/auth");
router.get('/public', (req, res) => {
    res.send('hello public route');
});
router.get("/protected", auth_1.authenticateToken, (req, res) => {
    res.send({ message: "This is a protected route sir2" });
});
// Export the router to be used in the main app
module.exports = router;
