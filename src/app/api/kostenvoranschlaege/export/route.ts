import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function escapeCsv(value: unknown) {
    if (value === null || value === undefined) return ""

    const stringValue = String(value).replace(/"/g, '""')

    if (
        stringValue.includes(";") ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
    ) {
        return `"${stringValue}"`
    }

    return stringValue
}

function formatDate(date: Date | null) {
    if (!date) return ""
    return date.toLocaleDateString("de-DE")
}

function getCustomerName(customer: any) {
    return (
        customer.name ||
        [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
        ""
    )
}

export async function GET() {
    const quotes = await prisma.quote.findMany({
        include: {
            customer: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    const headers = [
        "ID",
        "Kundennummer",
        "Name",
        "Typ",
        "Status",
        "Kostenträger",
        "Vorgangsnummer",
        "Genehmigungsnummer",
        "Genehmigungsdatum",
        "Genehmigt von",
        "Genehmigt bis",
        "Zuzahlungsbefreit",
        "Ablehnungsgrund",
        "PDF",
        "Vermittler",
        "Erstellt am",
    ]

    const rows = quotes.map((quote) => [
        quote.id,
        quote.customerNumber,
        getCustomerName(quote.customer),
        quote.type,
        quote.status,
        quote.insuranceName,
        quote.processNumber,
        quote.approvalNumber,
        formatDate(quote.approvalDate),
        formatDate(quote.approvedFrom),
        formatDate(quote.approvedUntil),
        quote.copaymentFree ? "Ja" : "Nein",
        quote.rejectionReason,
        quote.pdfUrl,
        quote.brokerName,
        formatDate(quote.createdAt),
    ])

    const csv = [
        headers.map(escapeCsv).join(";"),
        ...rows.map((row) => row.map(escapeCsv).join(";")),
    ].join("\n")

    return new NextResponse("\uFEFF" + csv, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition":
                'attachment; filename="kostenvoranschlaege.csv"',
        },
    })
}