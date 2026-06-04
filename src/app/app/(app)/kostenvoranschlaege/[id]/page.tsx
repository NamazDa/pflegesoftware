import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { approveQuote, rejectQuote } from "./actions"

const statusLabels: Record<string, string> = {
    OPEN: "Offen",
    APPROVED: "Genehmigt",
    REJECTED: "Abgelehnt",
    NO_RESPONSE: "Keine Antwort",
    FAILED: "Fehlgeschlagen",
    DELETED: "Gelöscht",
}

function getCustomerName(customer: any) {
    return (
        customer.name ||
        [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
        "Unbekannter Kunde"
    )
}

export default async function KostenvoranschlagDetailPage({
                                                              params,
                                                          }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const quote = await prisma.quote.findUnique({
        where: { id },
        include: {
            customer: true,
        },
    })

    if (!quote) {
        notFound()
    }

    const customerQuotes = await prisma.quote.findMany({
        where: {
            customerId: quote.customerId,
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    return (
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[320px_1fr]">
            <aside className="space-y-4">
                <Link
                    href="/app/kostenvoranschlaege"
                    className="text-sm underline"
                >
                    Zurück zur Übersicht
                </Link>

                <div className="rounded border p-4">
                    <h2 className="font-semibold">Kunde</h2>
                    <p className="mt-2 text-sm">{getCustomerName(quote.customer)}</p>
                </div>

                <div className="rounded border p-4">
                    <h2 className="font-semibold">
                        Historie aller Kostenvoranschläge
                    </h2>

                    <div className="mt-4 space-y-2">
                        {customerQuotes.map((item) => (
                            <Link
                                key={item.id}
                                href={`/app/kostenvoranschlaege/${item.id}`}
                                className="block rounded border p-3 text-sm hover:bg-gray-50"
                            >
                                <div className="font-medium">
                                    {item.type} {statusLabels[item.status]}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {item.createdAt.toLocaleDateString("de-DE")}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </aside>

            <main className="space-y-6">
                <div className="flex items-start justify-between rounded border p-4">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Kostenvoranschlag {quote.type}
                        </h1>
                        <p className="text-sm text-gray-500">
                            Status: {statusLabels[quote.status]}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {quote.status === "OPEN" && (
                            <>
                                <form action={approveQuote}>
                                    <input type="hidden" name="id" value={quote.id} />
                                    <button
                                        type="submit"
                                        className="rounded bg-green-700 px-4 py-2 text-sm text-white"
                                    >
                                        Genehmigen
                                    </button>
                                </form>

                                <form action={rejectQuote}>
                                    <input type="hidden" name="id" value={quote.id} />
                                    <input
                                        type="hidden"
                                        name="reason"
                                        value="Manuell abgelehnt"
                                    />
                                    <button
                                        type="submit"
                                        className="rounded bg-red-700 px-4 py-2 text-sm text-white"
                                    >
                                        Ablehnen
                                    </button>
                                </form>

                                <button className="rounded border px-4 py-2 text-sm">
                                    Bearbeiten
                                </button>
                            </>
                        )}

                        {quote.status === "APPROVED" && (
                            <button className="rounded border px-4 py-2 text-sm">
                                Bearbeiten
                            </button>
                        )}

                        {quote.status === "REJECTED" && (
                            <>
                                <button className="rounded border px-4 py-2 text-sm">
                                    Bearbeiten
                                </button>

                                {quote.pdfUrl && (
                                    <a
                                        href={quote.pdfUrl}
                                        className="rounded border px-4 py-2 text-sm"
                                    >
                                        Dokument anzeigen
                                    </a>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <section className="rounded border p-4">
                    <h2 className="font-semibold">Antragsdaten</h2>

                    <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <div>
                            <p className="text-gray-500">Erstellt am</p>
                            <p>{quote.createdAt.toLocaleDateString("de-DE")}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Kostenträger</p>
                            <p>{quote.insuranceName || "-"}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">KV Nummer</p>
                            <p>{quote.processNumber || "-"}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">PDF</p>
                            {quote.pdfUrl ? (
                                <a href={quote.pdfUrl} className="underline">
                                    PDF öffnen
                                </a>
                            ) : (
                                <p>-</p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="rounded border p-4">
                    <h2 className="font-semibold">Produktgruppen</h2>

                    <div className="mt-4 space-y-2 text-sm">
                        <div className="rounded border p-3">
                            {quote.type} Pflegehilfsmittel zum Verbrauch
                        </div>
                        <div className="rounded border p-3">
                            Dummy-Produktgruppe / spätere echte Positionen
                        </div>
                    </div>
                </section>

                {quote.status === "REJECTED" && (
                    <section className="rounded border p-4">
                        <h2 className="font-semibold">Ablehnung</h2>

                        <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                            <div>
                                <p className="text-gray-500">Ablehnungsdatum</p>
                                <p>{quote.updatedAt.toLocaleDateString("de-DE")}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">Ablehnungsgrund</p>
                                <p>{quote.rejectionReason || "-"}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">PDF</p>
                                {quote.pdfUrl ? (
                                    <a href={quote.pdfUrl} className="underline">
                                        PDF öffnen
                                    </a>
                                ) : (
                                    <p>-</p>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                <section className="rounded border p-4">
                    <h2 className="font-semibold">Abrechnung</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Bereich vorbereitet. Abrechnungslogik kommt später.
                    </p>
                </section>
            </main>
        </div>
    )
}