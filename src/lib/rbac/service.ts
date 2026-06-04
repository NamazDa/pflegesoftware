import { prisma } from "@/lib/prisma";

export async function userHasPermission(
    userId: string,
    permissionKey: string
): Promise<boolean> {
    const permission = await prisma.permission.findFirst({
        where: {
            key: permissionKey,
            rolePermissions: {
                some: {
                    role: {
                        userRoles: {
                            some: {
                                userId,
                            },
                        },
                    },
                },
            },
        },
    });

    return Boolean(permission);
}

export async function getUserPermissions(userId: string): Promise<string[]> {
    const userRoles = await prisma.userRole.findMany({
        where: {
            userId,
        },
        include: {
            role: {
                include: {
                    rolePermissions: {
                        include: {
                            permission: true,
                        },
                    },
                },
            },
        },
    });

    return [
        ...new Set(
            userRoles.flatMap((userRole) =>
                userRole.role.rolePermissions.map(
                    (rolePermission) => rolePermission.permission.key
                )
            )
        ),
    ];
}