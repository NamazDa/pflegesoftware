import { prisma } from "@/lib/prisma";

export async function getUserTenants(userId: string) {
    return prisma.tenantUser.findMany({
        where: {
            userId,
            status: "active",
            tenant: {
                status: "active",
            },
        },
        include: {
            tenant: true,
        },
    });
}

export async function getDefaultTenantForUser(userId: string) {
    const tenantUser = await prisma.tenantUser.findFirst({
        where: {
            userId,
            status: "active",
            tenant: {
                status: "active",
            },
        },
        include: {
            tenant: true,
        },
    });

    return tenantUser?.tenant ?? null;
}