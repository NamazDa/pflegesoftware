import Link from "next/link"
import type { QuoteStatus } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"

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

export default async function KostenvoranschlaegePage({
                                                          searchParams,
                                                      }: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
    const params = searchParams ? await searchParams : {}

    const status =
        typeof params.status === "string" && params.status !== ""
            ? params.status
            : undefined

    const insuranceName =
        typeof params.insuranceName === "string" && params.insuranceName !== ""
            ? params.insuranceName
            : undefined

    const date =
        typeof params.date === "string" && params.date !== ""
            ? params.date
            : undefined

    const where: any = {}

    if (status) {
        where.status = status as QuoteStatus
    }

    if (insuranceName) {
        where.insuranceName = {
            contains: insuranceName,
            mode: "insensitive",
        }
    }

    if (date) {
        const start = new Date(date)
        const end = new Date(date)
        end.setDate(end.getDate() + 1)

        where.createdAt = {
            gte: start,
            lt: end,
        }
    }

    const quotes = await prisma.quote.findMany({
        where,
        include: {
            customer: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Kostenvoranschläge</h1>
                    <p className="text-sm text-gray-500">
                        Übersicht aller Kostenvoranschläge
                    </p>
                </div>

                <a
                    href="/api/kostenvoranschlaege/export"
                    className="rounded bg-black px-4 py-2 text-sm text-white"
                >
                    Export CSV
                </a>
            </div>

            <form className="flex gap-3 rounded border p-4" method="get">
                <input
                    type="date"
                    name="date"
                    defaultValue={date}
                    className="rounded border px-3 py-2 text-sm"
                />

                <input
                    type="text"
                    name="insuranceName"
                    placeholder="Kostenträger"
                    defaultValue={insuranceName}
                    className="rounded border px-3 py-2 text-sm"
                />

                <select
                    name="status"
                    defaultValue={status}
                    className="rounded border px-3 py-2 text-sm"
                >
                    <option value="">Alle Status</option>
                    <option value="OPEN">Offen</option>
                    <option value="APPROVED">Genehmigt</option>
                    <option value="REJECTED">Abgelehnt</option>
                    <option value="NO_RESPONSE">Keine Antwort</option>
                    <option value="FAILED">Fehlgeschlagen</option>
                    <option value="DELETED">Gelöscht</option>
                </select>

                <button
                    type="submit"
                    className="rounded bg-black px-4 py-2 text-sm text-white"
                >
                    Filtern
                </button>

                <Link
                    href="/app/(app)/kostenvoranschlaege"
                    className="rounded border px-4 py-2 text-sm"
                >
                    Zurücksetzen
                </Link>
            </form>

            <div className="overflow-hidden rounded border">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Typ</th>
                        <th className="px-4 py-3 text-left">Kostenträger</th>
                        <th className="px-4 py-3 text-left">Erstellt am</th>
                    </tr>
                    </thead>

                    <tbody>
                    {quotes.map((quote) => (
                        <tr key={quote.id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3">{statusLabels[quote.status]}</td>

                            <td className="px-4 py-3">
                                <Link
                                    href={`/app/kostenvoranschlaege/${quote.id}`}
                                    className="font-medium underline"
                                >
                                    {getCustomerName(quote.customer)}
                                </Link>
                            </td>

                            <td className="px-4 py-3">{quote.type}</td>
                            <td className="px-4 py-3">{quote.insuranceName || "-"}</td>

                            <td className="px-4 py-3">
                                {quote.createdAt.toLocaleDateString("de-DE")}
                            </td>
                        </tr>
                    ))}

                    {quotes.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                Keine Kostenvoranschläge gefunden.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}