"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
class PrismaClientWrapper {
    constructor() {
        this.transaction = async (store_name) => {
            // Start a transaction
            const result = await this.prisma.$transaction(async (prisma) => {
                // Set tenant name session
                const tenant = await prisma.tenants.findUnique({
                    where: { store_name },
                });
                if (tenant) {
                    // Set tenant ID for subsequent queries
                    await prisma.$executeRaw `SET app.current_tenant_name = ${store_name}`;
                    await prisma.$executeRaw `SET app.current_tenant_id = ${tenant.id}`;
                    // Return tenant information
                    return tenant;
                }
                throw new Error('Tenant not found');
            });
            return result;
        };
        this.prisma = prisma;
    }
}
exports.default = PrismaClientWrapper;
