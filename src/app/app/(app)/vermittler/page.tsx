import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type VermittlerPageProps = {
    searchParams?: Promise<{
        q?: string;
    }>;
};

export default async function VermittlerPage({
                                                 searchParams,
                                             }: VermittlerPageProps) {
    const params = (await searchParams) ?? {};
    const search = params.q?.trim() ?? "";

    const brokers = await prisma.broker.findMany({
        where: search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        brokerNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        city: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            : undefined,
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <main style={styles.page}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Vermittler</h1>
                    <p style={styles.subtitle}>
                        Vermittler, Händler und Partner verwalten.
                    </p>
                </div>

                <Link href="/app/vermittler/new" style={styles.primaryButton}>
                    + Neuer Vermittler
                </Link>
            </div>

            <form method="GET" style={styles.searchForm}>
                <input
                    name="q"
                    defaultValue={search}
                    placeholder="Suchen nach Name, Nummer, E-Mail oder Ort..."
                    style={styles.searchInput}
                />

                <button type="submit" style={styles.secondaryButton}>
                    Suchen
                </button>

                {search ? (
                    <Link href="/vermittler" style={styles.clearLink}>
                        Zurücksetzen
                    </Link>
                ) : null}
            </form>

            <section style={styles.card}>
                <table style={styles.table}>
                    <thead>
                    <tr>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Typ</th>
                        <th style={styles.th}>Vermittlernummer</th>
                        <th style={styles.th}>E-Mail</th>
                        <th style={styles.th}>Ort</th>
                        <th style={styles.th}>Aktion</th>
                    </tr>
                    </thead>

                    <tbody>
                    {brokers.length === 0 ? (
                        <tr>
                            <td colSpan={6} style={styles.emptyCell}>
                                Noch keine Vermittler vorhanden.
                            </td>
                        </tr>
                    ) : (
                        brokers.map((broker) => (
                            <tr key={broker.id}>
                                <td style={styles.td}>
                                    <strong>{broker.name}</strong>
                                </td>
                                <td style={styles.td}>{broker.type ?? "-"}</td>
                                <td style={styles.td}>{broker.brokerNumber ?? "-"}</td>
                                <td style={styles.td}>{broker.email ?? "-"}</td>
                                <td style={styles.td}>{broker.city ?? "-"}</td>
                                <td style={styles.td}>
                                    <Link href={`/app/vermittler/${broker.id}`} style={styles.editLink}>
                                        Bearbeiten
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </section>
        </main>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        padding: "32px",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "24px",
        marginBottom: "24px",
    },
    title: {
        fontSize: "28px",
        fontWeight: 700,
        margin: 0,
    },
    subtitle: {
        marginTop: "6px",
        color: "#666",
    },
    primaryButton: {
        background: "#2f3ebd",
        color: "white",
        padding: "10px 16px",
        borderRadius: "8px",
        textDecoration: "none",
        fontWeight: 600,
    },
    searchForm: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "24px",
    },
    searchInput: {
        width: "420px",
        maxWidth: "100%",
        padding: "10px 12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "14px",
    },
    secondaryButton: {
        padding: "10px 14px",
        border: "1px solid #ccc",
        background: "white",
        borderRadius: "8px",
        cursor: "pointer",
    },
    clearLink: {
        color: "#2f3ebd",
        textDecoration: "none",
        fontWeight: 500,
    },
    card: {
        background: "white",
        border: "1px solid #e5e5e5",
        borderRadius: "12px",
        overflow: "hidden",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        textAlign: "left",
        padding: "14px 16px",
        background: "#f7f7f7",
        borderBottom: "1px solid #e5e5e5",
        fontSize: "14px",
    },
    td: {
        padding: "14px 16px",
        borderBottom: "1px solid #eee",
        fontSize: "14px",
    },
    emptyCell: {
        padding: "28px 16px",
        textAlign: "center",
        color: "#777",
    },
    editLink: {
        color: "#2f3ebd",
        fontWeight: 600,
        textDecoration: "none",
    },
};