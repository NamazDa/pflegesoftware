import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { prisma } from "@/lib/prisma";
import { deleteBroker, updateBroker } from "../actions";
import BrokerFeeFields from "../BrokerFeeFields";

export const dynamic = "force-dynamic";

type EditBrokerPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditBrokerPage({ params }: EditBrokerPageProps) {
    const { id } = await params;

    const broker = await prisma.broker.findUnique({
        where: {
            id,
        },
        include: {
            fees: {
                include: {
                    tiers: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
            },
        },
    });

    if (!broker) {
        notFound();
    }

    const updateBrokerWithId = updateBroker.bind(null, broker.id);
    const deleteBrokerWithId = deleteBroker.bind(null, broker.id);
    const currentFee = broker.fees[0];

    const initialFee = currentFee
        ? {
            validFrom: currentFee.validFrom,
            validTo: currentFee.validTo,
            type: currentFee.type as "FIX" | "CONTRIBUTION_MARGIN" | "TIERED",
            fixedAmount: currentFee.fixedAmount?.toString(),
            contributionRate: currentFee.contributionRate?.toString(),
            boxFixedCost: currentFee.boxFixedCost?.toString(),
            tiers: currentFee.tiers.map((tier) => ({
                fromQuantity: String(tier.fromQuantity),
                toQuantity: String(tier.toQuantity),
                amount: tier.amount.toString(),
            })),
        }
        : undefined;
    return (
        <main style={styles.page}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Vermittler bearbeiten</h1>
                    <p style={styles.subtitle}>{broker.name}</p>
                </div>

                <Link href="/app/vermittler" style={styles.backLink}>
                    Zurück
                </Link>
            </div>

            <form action={updateBrokerWithId} style={styles.form}>
                <Section title="1. Stammdaten">
                    <div style={styles.grid}>
                        <Field label="Name*" name="name" required defaultValue={broker.name} />

                        <SelectField
                            label="Typ"
                            name="type"
                            defaultValue={broker.type}
                            options={["Händler", "Vermittler", "Partner"]}
                        />

                        <Field
                            label="Vermittlernummer"
                            name="brokerNumber"
                            defaultValue={broker.brokerNumber}
                        />

                        <Field label="E-Mail" name="email" type="email" defaultValue={broker.email} />

                        <Field
                            label="E-Mail Rechnungen"
                            name="invoiceEmail"
                            type="email"
                            defaultValue={broker.invoiceEmail}
                        />

                        <Field label="IBAN" name="iban" defaultValue={broker.iban} />

                        <Field
                            label="Passwort für Anhänge"
                            name="attachmentPassword"
                            defaultValue={broker.attachmentPassword}
                        />

                        <SelectField
                            label="Erstellmodus Box"
                            name="boxCreationMode"
                            defaultValue={broker.boxCreationMode}
                            options={["Manuell", "Automatisch"]}
                        />
                    </div>

                    <div style={styles.checkboxRow}>
                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="notifyNewCustomer"
                                defaultChecked={broker.notifyNewCustomer}
                            />
                            E-Mail Benachrichtigung neuer Kunde
                        </label>

                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="notifyApproval"
                                defaultChecked={broker.notifyApproval}
                            />
                            E-Mail Benachrichtigung Genehmigung / Ablehnung
                        </label>
                    </div>

                    <TextArea label="Kommentar" name="comment" defaultValue={broker.comment} />
                </Section>

                <Section title="2. Adressinformationen">
                    <div style={styles.grid}>
                        <Field label="Titel" name="title" defaultValue={broker.title} />

                        <SelectField
                            label="Anrede"
                            name="salutation"
                            defaultValue={broker.salutation}
                            options={["Herr", "Frau", "Divers"]}
                        />

                        <Field label="Vorname" name="firstName" defaultValue={broker.firstName} />
                        <Field label="Nachname" name="lastName" defaultValue={broker.lastName} />
                        <Field label="Straße" name="street" defaultValue={broker.street} />
                        <Field label="Hausnummer" name="houseNumber" defaultValue={broker.houseNumber} />

                        <Field
                            label="Hausnummer Zusatz"
                            name="houseNumberSuffix"
                            defaultValue={broker.houseNumberSuffix}
                        />

                        <Field
                            label="Adresszusatz"
                            name="addressAddition"
                            defaultValue={broker.addressAddition}
                        />

                        <Field
                            label="Adresszusatz 2"
                            name="addressAddition2"
                            defaultValue={broker.addressAddition2}
                        />

                        <Field label="PLZ" name="zip" defaultValue={broker.zip} />
                        <Field label="Ort" name="city" defaultValue={broker.city} />
                        <Field label="Land" name="country" defaultValue={broker.country ?? "DE"} />
                    </div>
                </Section>

                <Section title="3. API Zugangsdaten">
                    <label style={styles.checkboxLabel}>
                        <input type="checkbox" name="apiEnabled" defaultChecked={broker.apiEnabled} />
                        API aktiv
                    </label>

                    <div style={styles.grid}>
                        <Field label="API Key" name="apiKey" defaultValue={broker.apiKey} />
                        <Field label="Webhook URL" name="webhookUrl" defaultValue={broker.webhookUrl} />

                        <Field
                            label="Externe Partner-ID"
                            name="externalPartnerId"
                            defaultValue={broker.externalPartnerId}
                        />
                    </div>
                </Section>

                <Section title="4. Beratungshonorar">
                    <BrokerFeeFields initialFee={initialFee} />
                </Section>

                <div style={styles.actions}>
                    <Link href="/app/vermittler" style={styles.cancelButton}>
                        Abbrechen
                    </Link>

                    <button type="submit" style={styles.saveButton}>
                        Änderungen speichern
                    </button>
                </div>
            </form>

            <form action={deleteBrokerWithId} style={styles.deleteForm}>
                <button type="submit" style={styles.deleteButton}>
                    Vermittler löschen
                </button>
            </form>
        </main>
    );
}

function Section({
                     title,
                     children,
                 }: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>{title}</h2>
            {children}
        </section>
    );
}

function Field({
                   label,
                   name,
                   type = "text",
                   required = false,
                   defaultValue,
               }: {
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    defaultValue?: string | null;
}) {
    return (
        <label style={styles.field}>
            <span style={styles.label}>{label}</span>
            <input
                name={name}
                type={type}
                required={required}
                defaultValue={defaultValue ?? ""}
                style={styles.input}
            />
        </label>
    );
}

function SelectField({
                         label,
                         name,
                         options,
                         defaultValue,
                     }: {
    label: string;
    name: string;
    options: string[];
    defaultValue?: string | null;
}) {
    return (
        <label style={styles.field}>
            <span style={styles.label}>{label}</span>
            <select name={name} defaultValue={defaultValue ?? ""} style={styles.input}>
                <option value="">Bitte wählen</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
    );
}

function TextArea({
                      label,
                      name,
                      defaultValue,
                  }: {
    label: string;
    name: string;
    defaultValue?: string | null;
}) {
    return (
        <label style={styles.fieldFull}>
            <span style={styles.label}>{label}</span>
            <textarea name={name} rows={4} defaultValue={defaultValue ?? ""} style={styles.textarea} />
        </label>
    );
}

const styles: Record<string, CSSProperties> = {
    page: {
        padding: "32px",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
    },
    title: {
        margin: 0,
        fontSize: "28px",
        fontWeight: 700,
    },
    subtitle: {
        marginTop: "6px",
        color: "#666",
    },
    backLink: {
        color: "#2f3ebd",
        textDecoration: "none",
        fontWeight: 600,
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        maxWidth: "1100px",
    },
    section: {
        background: "white",
        border: "1px solid #e5e5e5",
        borderRadius: "12px",
        padding: "24px",
    },
    sectionTitle: {
        marginTop: 0,
        marginBottom: "20px",
        fontSize: "20px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "18px",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    fieldFull: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        marginTop: "18px",
    },
    label: {
        fontSize: "14px",
        color: "#555",
        fontWeight: 500,
    },
    input: {
        padding: "10px 12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "14px",
    },
    textarea: {
        padding: "10px 12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "14px",
        resize: "vertical",
    },
    checkboxRow: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginTop: "18px",
    },
    checkboxLabel: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "14px",
        marginBottom: "18px",
    },
    note: {
        margin: 0,
        color: "#777",
    },
    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        paddingBottom: "8px",
    },
    cancelButton: {
        padding: "10px 16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        color: "#333",
        textDecoration: "none",
    },
    saveButton: {
        padding: "10px 16px",
        borderRadius: "8px",
        border: "none",
        background: "#2f3ebd",
        color: "white",
        fontWeight: 600,
        cursor: "pointer",
    },
    deleteForm: {
        marginTop: "24px",
        maxWidth: "1100px",
        display: "flex",
        justifyContent: "flex-end",
        paddingBottom: "40px",
    },
    deleteButton: {
        padding: "10px 16px",
        borderRadius: "8px",
        border: "1px solid #d32f2f",
        background: "white",
        color: "#d32f2f",
        fontWeight: 600,
        cursor: "pointer",
    },
};