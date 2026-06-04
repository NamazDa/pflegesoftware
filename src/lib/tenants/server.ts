import { redirect } from "next/navigation";
import { getDefaultTenantForUser } from "@/lib/tenants/service";

export async function requireTenant(userId: string) {
    const tenant = await getDefaultTenantForUser(userId);

    if (!tenant) {
        redirect("/no-tenant");
    }

    return tenant;
}