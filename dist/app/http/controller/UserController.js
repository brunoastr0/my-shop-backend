"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const UserService_1 = require("../services/UserService"); // Adjust the import according to your file structure
class UserController {
    // Create a new user
    async createUser(req, res) {
        const { email, password } = req.body;
        try {
            const user = await UserService_1.userService.createUser(email, password);
            return res.status(201).json({ user });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    // User login
    async login(req, res) {
        const { email, password } = req.body;
        try {
            const { accessToken, refreshToken } = await UserService_1.userService.login(email, password);
            return res.status(200).json({ accessToken, refreshToken });
        }
        catch (error) {
            return res.status(401).json({ message: error.message });
        }
    }
}
exports.userController = new UserController();
