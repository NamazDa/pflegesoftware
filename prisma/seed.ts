import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Roles, Permissions } from "../src/lib/rbac/constants";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    const permissionKeys = Object.values(Permissions);

    for (const key of permissionKeys) {
        await prisma.permission.upsert({
            where: { key },
            update: {},
            create: {
                key,
                description: key,
            },
        });
    }

    const superAdminRole = await prisma.role.upsert({
        where: { name: Roles.SUPER_ADMIN },
        update: {},
        create: {
            name: Roles.SUPER_ADMIN,
            description: "Hat alle Rechte",
        },
    });

    const permissions = await prisma.permission.findMany();

    for (const permission of permissions) {
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: superAdminRole.id,
                    permissionId: permission.id,
                },
            },
            update: {},
            create: {
                roleId: superAdminRole.id,
                permissionId: permission.id,
            },
        });
    }

    const tenant = await prisma.tenant.upsert({
        where: { slug: "demo-pflegebox" },
        update: {},
        create: {
            name: "Demo Pflegebox GmbH",
            slug: "demo-pflegebox",
            status: "active",
        },
    });

    await prisma.tenantSetting.upsert({
        where: {
            tenantId_key: {
                tenantId: tenant.id,
                key: "shipping_provider",
            },
        },
        update: {
            value: "DHL",
        },
        create: {
            tenantId: tenant.id,
            key: "shipping_provider",
            value: "DHL",
        },
    });

    console.log("Seed fertig.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });