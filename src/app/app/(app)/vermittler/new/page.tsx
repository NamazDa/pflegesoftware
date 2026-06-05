import Link from "next/link";
import { createBroker } from "../actions";
import BrokerFeeFields from "../BrokerFeeFields";

export default function NewBrokerPage() {
    return (
        <main style={styles.page}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Vermittler anlegen</h1>
                    <p style={styles.subtitle}>Neuen Vermittler, Händler oder Partner erstellen.</p>
                </div>

                <Link href="/app/vermittler" style={styles.backLink}>
                    Zurück
                </Link>
            </div>

            <form action={createBroker} style={styles.form}>
                <Section title="1. Stammdaten">
                    <div style={styles.grid}>
                        <Field label="Name*" name="name" required />
                        <SelectField
                            label="Typ"
                            name="type"
                            options={["Händler", "Vermittler", "Partner"]}
                        />
                        <Field label="Vermittlernummer" name="brokerNumber" />
                        <Field label="E-Mail" name="email" type="email" />
                        <Field label="E-Mail Rechnungen" name="invoiceEmail" type="email" />
                        <Field label="IBAN" name="iban" />
                        <Field label="Passwort für Anhänge" name="attachmentPassword" />
                        <SelectField
                            label="Erstellmodus Box"
                            name="boxCreationMode"
                            options={["Manuell", "Automatisch"]}
                        />
                    </div>

                    <div style={styles.checkboxRow}>
                        <label style={styles.checkboxLabel}>
                            <input type="checkbox" name="notifyNewCustomer" />
                            E-Mail Benachrichtigung neuer Kunde
                        </label>

                        <label style={styles.checkboxLabel}>
                            <input type="checkbox" name="notifyApproval" />
                            E-Mail Benachrichtigung Genehmigung / Ablehnung
                        </label>
                    </div>

                    <TextArea label="Kommentar" name="comment" />
                </Section>

                <Section title="2. Adressinformationen">
                    <div style={styles.grid}>
                        <Field label="Titel" name="title" />
                        <SelectField label="Anrede" name="salutation" options={["Herr", "Frau", "Divers"]} />
                        <Field label="Vorname" name="firstName" />
                        <Field label="Nachname" name="lastName" />
                        <Field label="Straße" name="street" />
                        <Field label="Hausnummer" name="houseNumber" />
                        <Field label="Hausnummer Zusatz" name="houseNumberSuffix" />
                        <Field label="Adresszusatz" name="addressAddition" />
                        <Field label="Adresszusatz 2" name="addressAddition2" />
                        <Field label="PLZ" name="zip" />
                        <Field label="Ort" name="city" />
                        <Field label="Land" name="country" defaultValue="DE" />
                    </div>
                </Section>

                <Section title="3. API Zugangsdaten">
                    <label style={styles.checkboxLabel}>
                        <input type="checkbox" name="apiEnabled" />
                        API aktiv
                    </label>

                    <div style={styles.grid}>
                        <Field label="API Key" name="apiKey" />
                        <Field label="Webhook URL" name="webhookUrl" />
                        <Field label="Externe Partner-ID" name="externalPartnerId" />
                    </div>
                </Section>

                <Section title="4. Beratungshonorar">
                    <BrokerFeeFields />
                </Section>

                <div style={styles.actions}>
                    <Link href="/app/vermittler" style={styles.cancelButton}>
                        Abbrechen
                    </Link>

                    <button type="submit" style={styles.saveButton}>
                        Speichern
                    </button>
                </div>
            </form>
        </main>
    );
}

function Section({
                     title,
                     children,
                 }: {
    title: string;
    children: React.ReactNode;
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
    defaultValue?: string;
}) {
    return (
        <label style={styles.field}>
            <span style={styles.label}>{label}</span>
            <input
                name={name}
                type={type}
                required={required}
                defaultValue={defaultValue}
                style={styles.input}
            />
        </label>
    );
}

function SelectField({
                         label,
                         name,
                         options,
                     }: {
    label: string;
    name: string;
    options: string[];
}) {
    return (
        <label style={styles.field}>
            <span style={styles.label}>{label}</span>
            <select name={name} defaultValue="" style={styles.input}>
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

function TextArea({ label, name }: { label: string; name: string }) {
    return (
        <label style={styles.fieldFull}>
            <span style={styles.label}>{label}</span>
            <textarea name={name} rows={4} style={styles.textarea} />
        </label>
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
    },
    note: {
        margin: 0,
        color: "#777",
    },
    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        paddingBottom: "32px",
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
};