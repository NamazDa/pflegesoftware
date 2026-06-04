export const Roles = {
    SUPER_ADMIN: "super_admin",
    ADMIN: "admin",
    EMPLOYEE: "employee",
} as const;

export type Role = typeof Roles[keyof typeof Roles];

export const Permissions = {
    USER_VIEW: "user:view",
    USER_CREATE: "user:create",
    USER_UPDATE: "user:update",
    USER_DELETE: "user:delete",

    CUSTOMER_VIEW: "customer:view",
    CUSTOMER_CREATE: "customer:create",
    CUSTOMER_UPDATE: "customer:update",
    CUSTOMER_DELETE: "customer:delete",

    ROLE_VIEW: "role:view",
    ROLE_CREATE: "role:create",
    ROLE_UPDATE: "role:update",
    ROLE_DELETE: "role:delete",

    AUDIT_LOG_VIEW: "audit-log:view",
} as const;

export type Permission = typeof Permissions[keyof typeof Permissions];