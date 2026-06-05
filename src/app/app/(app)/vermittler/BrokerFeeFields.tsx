"use client";

import { useState } from "react";

type FeeType = "" | "FIX" | "CONTRIBUTION_MARGIN" | "TIERED";

type TierRow = {
    id: string;
    fromQuantity: string;
    toQuantity: string;
    amount: string;
};

type BrokerFeeFieldsProps = {
    initialFee?: {
        validFrom?: string;
        validTo?: string;
        type?: FeeType;
        fixedAmount?: string;
        contributionRate?: string;
        boxFixedCost?: string;
        tiers?: {
            fromQuantity: string;
            toQuantity: string;
            amount: string;
        }[];
    };
};

export default function BrokerFeeFields({ initialFee }: BrokerFeeFieldsProps) {
    const [feeType, setFeeType] = useState<FeeType>(initialFee?.type ?? "");

    const [tiers, setTiers] = useState<TierRow[]>(
        initialFee?.tiers?.length
            ? initialFee.tiers.map((tier, index) => ({
                id: String(index + 1),
                fromQuantity: tier.fromQuantity,
                toQuantity: tier.toQuantity,
                amount: tier.amount,
            }))
            : [
                {
                    id: "1",
                    fromQuantity: "1",
                    toQuantity: "10",
                    amount: "",
                },
            ]
    );

    function addTier() {
        setTiers((current) => [
            ...current,
            {
                id: crypto.randomUUID(),
                fromQuantity: "",
                toQuantity: "",
                amount: "",
            },
        ]);
    }

    function removeTier(id: string) {
        setTiers((current) => current.filter((tier) => tier.id !== id));
    }

    function updateTier(id: string, field: keyof Omit<TierRow, "id">, value: string) {
        setTiers((current) =>
            current.map((tier) =>
                tier.id === id
                    ? {
                        ...tier,
                        [field]: value,
                    }
                    : tier
            )
        );
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.grid}>
                <label style={styles.field}>
                    <span style={styles.label}>Gültig von</span>
                    <input
                        name="feeValidFrom"
                        type="month"
                        defaultValue={initialFee?.validFrom ?? ""}
                        style={styles.input}
                    />
                </label>

                <label style={styles.field}>
                    <span style={styles.label}>Gültig bis</span>
                    <input
                        name="feeValidTo"
                        type="month"
                        defaultValue={initialFee?.validTo ?? ""}
                        style={styles.input}
                    />
                </label>

                <label style={styles.fieldFull}>
                    <span style={styles.label}>Honorar-Art</span>
                    <select
                        name="feeType"
                        value={feeType}
                        onChange={(event) => setFeeType(event.target.value as FeeType)}
                        style={styles.input}
                    >
                        <option value="">Kein Beratungshonorar</option>
                        <option value="FIX">Fix</option>
                        <option value="CONTRIBUTION_MARGIN">Deckungsbeitrag</option>
                        <option value="TIERED">Staffel</option>
                    </select>
                </label>
            </div>

            {feeType === "FIX" ? (
                <div style={styles.grid}>
                    <label style={styles.field}>
                        <span style={styles.label}>Fixbetrag €</span>
                        <input
                            name="fixedAmount"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={initialFee?.fixedAmount ?? ""}
                            style={styles.input}
                        />
                    </label>
                </div>
            ) : null}

            {feeType === "CONTRIBUTION_MARGIN" ? (
                <div style={styles.grid}>
                    <label style={styles.field}>
                        <span style={styles.label}>Deckungsbeitrag Prozent</span>
                        <input
                            name="contributionRate"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={initialFee?.contributionRate ?? ""}
                            style={styles.input}
                        />
                    </label>

                    <label style={styles.field}>
                        <span style={styles.label}>Box-Fixkosten €</span>
                        <input
                            name="boxFixedCost"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={initialFee?.boxFixedCost ?? ""}
                            style={styles.input}
                        />
                    </label>
                </div>
            ) : null}

            {feeType === "TIERED" ? (
                <div style={styles.tierBlock}>
                    <div style={styles.tierHeader}>
                        <h3 style={styles.tierTitle}>Staffelung</h3>

                        <button type="button" onClick={addTier} style={styles.addButton}>
                            + Staffel hinzufügen
                        </button>
                    </div>

                    <div style={styles.tiers}>
                        {tiers.map((tier) => (
                            <div key={tier.id} style={styles.tierRow}>
                                <label style={styles.field}>
                                    <span style={styles.label}>Von</span>
                                    <input
                                        name="tierFrom"
                                        type="number"
                                        min="1"
                                        value={tier.fromQuantity}
                                        onChange={(event) =>
                                            updateTier(tier.id, "fromQuantity", event.target.value)
                                        }
                                        style={styles.input}
                                    />
                                </label>

                                <label style={styles.field}>
                                    <span style={styles.label}>Bis</span>
                                    <input
                                        name="tierTo"
                                        type="number"
                                        min="1"
                                        value={tier.toQuantity}
                                        onChange={(event) =>
                                            updateTier(tier.id, "toQuantity", event.target.value)
                                        }
                                        style={styles.input}
                                    />
                                </label>

                                <label style={styles.field}>
                                    <span style={styles.label}>Beratungshonorar €</span>
                                    <input
                                        name="tierAmount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={tier.amount}
                                        onChange={(event) => updateTier(tier.id, "amount", event.target.value)}
                                        style={styles.input}
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={() => removeTier(tier.id)}
                                    style={styles.deleteButton}
                                >
                                    Löschen
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    wrapper: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
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
        gridColumn: "1 / -1",
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
    tierBlock: {
        borderTop: "1px solid #eee",
        paddingTop: "20px",
    },
    tierHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
    },
    tierTitle: {
        margin: 0,
        fontSize: "18px",
    },
    addButton: {
        border: "1px solid #2f3ebd",
        background: "white",
        color: "#2f3ebd",
        borderRadius: "8px",
        padding: "8px 12px",
        fontWeight: 600,
        cursor: "pointer",
    },
    tiers: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
    },
    tierRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr auto",
        gap: "12px",
        alignItems: "end",
    },
    deleteButton: {
        border: "1px solid #d32f2f",
        background: "white",
        color: "#d32f2f",
        borderRadius: "8px",
        padding: "10px 12px",
        cursor: "pointer",
    },
};