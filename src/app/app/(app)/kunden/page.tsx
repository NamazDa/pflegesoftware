import { PageHeader, Button } from "@/components/ui";
import { CustomerList } from "@/components/features/kunden/CustomerList";
import { prisma } from "@/lib/prisma";

export default async function KundenPage() {
    const customers = await prisma.customer.findMany({
        where: {
            deletedAt: null,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div>
            <PageHeader
                title="Kunden"
                description={`${customers.length} Kunden gesamt`}
                action={<Button size="sm">+ Neuer Kunde</Button>}
            />

            <CustomerList
                customers={customers.map((customer) => ({
                    id: customer.id,
                    tenantId: customer.tenantId,
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    birthDate: customer.birthDate?.toISOString() ?? "",
                    insuranceNumber: customer.insuranceNumber ?? "",
                    address: {
                        street: "",
                        houseNumber: "",
                        zip: "",
                        city: "",
                        country: "DE",
                    },
                    status:
                        customer.status === "ACTIVE"
                            ? "active"
                            : customer.status === "PENDING_APPROVAL"
                                ? "pending"
                                : "inactive",
                    tags: customer.tags ?? [],
                    createdAt: customer.createdAt.toISOString(),
                    updatedAt: customer.updatedAt.toISOString(),
                }))}
            />
        </div>
    );
}