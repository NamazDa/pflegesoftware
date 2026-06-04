import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Roles, Permissions } from "../src/lib/rbac/constants";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {


    const hashedPassword = await bcrypt.hash("admin1234", 12);

    // ─── 1. PERMISSIONS ───────────────────────────────────────────
    const permissionKeys = Object.values(Permissions);

    for (const key of permissionKeys) {
        await prisma.permission.upsert({
            where: { key },
            update: {},
            create: { key, description: key },
        });
    }
    console.log("✅ Permissions erstellt");

    // ─── 2. ROLLEN ────────────────────────────────────────────────
    const superAdminRole = await prisma.role.upsert({
        where: { name: Roles.SUPER_ADMIN },
        update: {},
        create: { name: Roles.SUPER_ADMIN, description: "Hat alle Rechte" },
    });

    const adminRole = await prisma.role.upsert({
        where: { name: Roles.ADMIN },
        update: {},
        create: { name: Roles.ADMIN, description: "Zugriff auf die meisten Bereiche" },
    });

    const employeeRole = await prisma.role.upsert({
        where: { name: Roles.EMPLOYEE },
        update: {},
        create: { name: Roles.EMPLOYEE, description: "Eingeschränkter Zugriff" },
    });
    console.log("✅ Rollen erstellt");

    // ─── 3. PERMISSIONS PRO ROLLE ─────────────────────────────────
    const allPermissions = await prisma.permission.findMany();

    const adminPermissionKeys = [
        Permissions.USER_VIEW,
        Permissions.USER_CREATE,
        Permissions.USER_UPDATE,
        Permissions.CUSTOMER_VIEW,
        Permissions.CUSTOMER_CREATE,
        Permissions.CUSTOMER_UPDATE,
        Permissions.ROLE_VIEW,
        Permissions.AUDIT_LOG_VIEW,
    ];

    const employeePermissionKeys = [
        Permissions.CUSTOMER_VIEW,
        Permissions.USER_VIEW,
    ];

    // super_admin → alle Permissions
    for (const permission of allPermissions) {
        await prisma.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: permission.id } },
            update: {},
            create: { roleId: superAdminRole.id, permissionId: permission.id },
        });
    }

    // admin → ausgewählte Permissions
    for (const key of adminPermissionKeys) {
        const permission = allPermissions.find((p) => p.key === key);
        if (!permission) continue;
        await prisma.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: adminRole.id, permissionId: permission.id } },
            update: {},
            create: { roleId: adminRole.id, permissionId: permission.id },
        });
    }

    // employee → eingeschränkte Permissions
    for (const key of employeePermissionKeys) {
        const permission = allPermissions.find((p) => p.key === key);
        if (!permission) continue;
        await prisma.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: employeeRole.id, permissionId: permission.id } },
            update: {},
            create: { roleId: employeeRole.id, permissionId: permission.id },
        });
    }
    console.log("✅ Rollen mit Permissions verknüpft");

    // ─── 4. DEMO TENANT ───────────────────────────────────────────
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
        where: { tenantId_key: { tenantId: tenant.id, key: "shipping_provider" } },
        update: { value: "DHL" },
        create: { tenantId: tenant.id, key: "shipping_provider", value: "DHL" },
    });
    console.log("✅ Demo Tenant erstellt");

    // ─── 5. DEMO USER ─────────────────────────────────────────────
    const demoUser = await prisma.user.upsert({
        where: { email: "toygar@demo-pflegebox.de" },
        update: {
            password: hashedPassword,
            name: "Toygar",
        },
        create: {
            email: "toygar@demo-pflegebox.de",
            password: hashedPassword,
            name: "Toygar",
        },
    });

    // User → super_admin Rolle
    await prisma.userRole.upsert({
        where: { userId_roleId: { userId: demoUser.id, roleId: superAdminRole.id } },
        update: {},
        create: { userId: demoUser.id, roleId: superAdminRole.id },
    });

    // User → Demo Tenant
    await prisma.tenantUser.upsert({
        where: { tenantId_userId: { tenantId: tenant.id, userId: demoUser.id } },
        update: {},
        create: { tenantId: tenant.id, userId: demoUser.id, status: "active" },
    });
    console.log("✅ Demo User erstellt");

    console.log("🎉 Seed fertig.");
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