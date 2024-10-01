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
exports.userService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importStar(require("../../utils/prismaClient"));
class UserService {
    // Create a new user
    async createUser(email, password) {
        try {
            const tenantPrisma = prismaClient_1.default.$extends((0, prismaClient_1.forTenant)("bec6b92a-317f-4e83-ab3e-b90dcf93ed38"));
            const existingUser = await tenantPrisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                throw new Error("Email already in use.");
            }
            const hashedPassword = bcrypt_1.default.hashSync(password, 10);
            const createdUser = await prismaClient_1.default.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });
            // Log the generated UUID
            console.log("Generated UUID:", createdUser.id);
            return createdUser;
        }
        catch (error) {
            console.log(error);
        }
    }
    // User login
    async login(email, password) {
        const user = await prismaClient_1.default.user.findUnique({
            where: { email },
        });
        if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
            throw new Error("Invalid email or password.");
        }
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);
        await prismaClient_1.default.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        return { accessToken, refreshToken };
    }
    // Generate access token
    generateAccessToken(user) {
        return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    }
    // Generate refresh token
    generateRefreshToken(user) {
        return jsonwebtoken_1.default.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "15d",
        });
    }
}
// Export an instance of UserService
exports.userService = new UserService();
