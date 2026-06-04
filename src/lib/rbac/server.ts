import { redirect } from "next/navigation";
import { userHasPermission } from "@/lib/rbac/service";

export async function requirePermission(
    userId: string,
    permissionKey: string
): Promise<void> {
    const allowed = await userHasPermission(userId, permissionKey);

    if (!allowed) {
        redirect("/403");
    }
}