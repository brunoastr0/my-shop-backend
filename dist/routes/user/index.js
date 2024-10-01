"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../../app/http/controller/UserController");
const router = (0, express_1.Router)();
// GET /products - Fetch products for the current tenant based on subdomain
router.post('/register', async (req, res) => {
    try {
        const createUser = UserController_1.userController.createUser.bind(UserController_1.userController);
        createUser(req, res);
    }
    catch (error) {
        console.log(error);
    }
});
router.post('/login', async (req, res) => {
    try {
        UserController_1.userController.login.bind(UserController_1.userController);
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = router;
