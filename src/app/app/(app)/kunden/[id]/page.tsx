import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface CustomerDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

function formatDate(date: Date | null) {
    if (!date) return "—";
    return new Intl.DateTimeFormat("de-DE").format(date);
}

function value(value?: string | number | null) {
    return value || "—";
}

function StatusBadge({ label }: { label?: string | null }) {
    if (!label) {
        return <span className="text-sm text-gray-400">—</span>;
    }

    return (
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      {label}
    </span>
    );
}

export default async function CustomerDetailPage({
                                                     params,
                                                 }: CustomerDetailPageProps) {
    const { id } = await params;

    const customer = await prisma.customer.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    console.log(customer);


    if (!customer) {
        notFound();
    }

    const address = [
        customer.street,
        customer.houseNumber,
        customer.houseNumberSuffix,
    ]
        .filter(Boolean)
        .join(" ");

    const cityLine = [customer.zip, customer.city].filter(Boolean).join(" ");

    return (
        <div className="space-y-6">
            <div>
                <Link href="/app/kunden" className="text-sm text-gray-500 hover:text-gray-900">
                    ← Zurück zu Kunden
                </Link>

                <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {customer.firstName} {customer.lastName}
                        </h1>
                        <p className="text-sm text-gray-500">
                            Kundendetailseite · {customer.insuranceNumber ?? "keine Versichertennummer"}
                        </p>
                    </div>

                    <StatusBadge label={customer.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <section className="rounded-xl border border-gray-200 bg-white p-6 xl:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-900">Stammdaten</h2>

                    <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                        <div>
                            <p className="text-gray-400">Vorname</p>
                            <p className="font-medium">{customer.firstName}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Nachname</p>
                            <p className="font-medium">{customer.lastName}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Geburtsdatum</p>
                            <p className="font-medium">{formatDate(customer.birthDate)}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Pflegegrad</p>
                            <p className="font-medium">{customer.careLevel ? `PG ${customer.careLevel}` : "—"}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Telefon</p>
                            <p className="font-medium">{value(customer.phone)}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">E-Mail</p>
                            <p className="font-medium">{value(customer.email)}</p>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-gray-900">Genehmigungen</h2>

                    <div className="mt-4 space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">PG51</span>
                            <StatusBadge label={customer.pg51Status} />
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">PG54</span>
                            <StatusBadge label={customer.pg54Status} />
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-gray-900">Versicherung</h2>

                    <div className="mt-4 space-y-4 text-sm">
                        <div>
                            <p className="text-gray-400">Versichertennummer</p>
                            <p className="font-medium">{value(customer.insuranceNumber)}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Versicherungsart</p>
                            <p className="font-medium">{value(customer.insuranceType)}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Krankenkasse</p>
                            <p className="font-medium">{value(customer.insuranceName)}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">IK Nummer</p>
                            <p className="font-medium">{value(customer.insuranceIk)}</p>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-gray-900">Adresse</h2>

                    <div className="mt-4 space-y-2 text-sm">
                        <p className="font-medium">{address || "—"}</p>
                        <p className="font-medium">{cityLine || "—"}</p>
                        <p className="text-gray-500">{customer.country ?? "DE"}</p>
                    </div>
                </section>

                <section className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-gray-900">Vermittler</h2>

                    <div className="mt-4 space-y-4 text-sm">
                        <div>
                            <p className="text-gray-400">Name</p>
                            <p className="font-medium">{value(customer.brokerName)}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Vermittlernummer</p>
                            <p className="font-medium">{value(customer.brokerNumber)}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Shop</p>
                            <p className="font-medium">{value(customer.brokerShop)}</p>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-gray-200 bg-white p-6 xl:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-900">Anmerkungen</h2>

                    <p className="mt-4 text-sm text-gray-700">
                        {customer.notes || "Keine Anmerkungen vorhanden."}
                    </p>
                </section>

                <section className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-gray-900">Pflegeboxen</h2>

                    <p className="mt-4 text-sm text-gray-500">
                        Noch keine Pflegeboxen hinterlegt.
                    </p>
                </section>
            </div>
        </div>
    );
}