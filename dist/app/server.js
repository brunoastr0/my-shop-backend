"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const client_1 = require("../node_modules/.prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import orders from "../routes/orders"
const products_1 = __importDefault(require("../routes/products"));
const user_1 = __importDefault(require("../routes/user"));
// import { pgMiddleware } from "./http/middlewares/tenantMiddleware";
const routes = require('../routes/index.ts');
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
// app.use(pgMiddleware);
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_1.urlencoded)({ extended: true }));
app.get("/health", async (req, res) => {
    try {
        await prisma.$connect(); // Ensure DB connection
        res.send("Database connected.");
    }
    catch (err) {
        res.status(500).send("Database connection failed.");
    }
});
app.use('/api', routes);
// app.use('/api', orders);
app.use('/api', products_1.default);
app.use('/api', user_1.default);
const start = async () => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running at http://localhost:${process.env.PORT}`);
    });
};
start();
