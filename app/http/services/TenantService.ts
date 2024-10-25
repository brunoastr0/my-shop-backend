import bcrypt from "bcrypt";
import prisma, { bypassRLS } from "../../utils/prismaClient";


class TenantService {
    prisma;
    constructor() {
        this.prisma = prisma.$extends(bypassRLS()); // Use bypassRLS by default for this instance
    }
    async createTenantAndAdmin(tenantName: string, adminEmail: string, adminPassword: string) {



        const result = await this.prisma.$transaction(async (tx) => {
            const existingTenant = await tx.tenant.findFirst({

                where: { name: tenantName }

            })
            if (existingTenant) {
                throw new Error("Tenant ja existe")
            }
            const tenant = await tx.tenant.create({
                data: {
                    id: crypto.randomUUID(),
                    name: tenantName,
                },
            });

            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            await tx.$executeRaw`SELECT set_config('app.current_tenant_id', ${tenant.id}, TRUE)`;

            const adminUser = await tx.user.create({
                data: {
                    id: crypto.randomUUID(),
                    email: adminEmail,
                    password: hashedPassword,
                    role: "tenant_admin",
                },
            });

            return { tenant, adminUser };
        });

        return result;

    }

    // Method to create a super admin (without tenant restriction)
    async createSuperAdmin(email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const superAdminUser = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'super_admin', // Assign role
            },
        });

        return superAdminUser;
    }

    // Additional methods like updateUser, deleteUser, etc. can be added here
}

// Export an instance of TenantService
export const tenantService = new TenantService();
