"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const DEMO_TENANT_ID = "demo-tenant";

function getString(formData: FormData, key: string) {
    const value = formData.get(key);
    if (typeof value !== "string") return null;

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function getBoolean(formData: FormData, key: string) {
    return formData.get(key) === "on";
}

function getNumberString(formData: FormData, key: string) {
    const value = getString(formData, key);
    if (!value) return null;

    const normalized = value.replace(",", ".");
    const parsed = Number(normalized);

    if (Number.isNaN(parsed) || parsed < 0) {
        throw new Error(`${key} ist ungültig.`);
    }

    return normalized;
}

function buildFeeData(formData: FormData) {
    const validFrom = getString(formData, "feeValidFrom");
    const validTo = getString(formData, "feeValidTo");
    const type = getString(formData, "feeType");

    if (!type) return null;

    if (!validFrom || !validTo) {
        throw new Error("Bei Beratungshonorar müssen Gültig von und Gültig bis gesetzt sein.");
    }

    if (!["FIX", "CONTRIBUTION_MARGIN", "TIERED"].includes(type)) {
        throw new Error("Ungültige Honorar-Art.");
    }

    if (type === "FIX") {
        const fixedAmount = getNumberString(formData, "fixedAmount");

        if (!fixedAmount) {
            throw new Error("Bei Fix-Honorar muss ein Fixbetrag gesetzt sein.");
        }

        return {
            validFrom,
            validTo,
            type,
            fixedAmount,
            contributionRate: null,
            boxFixedCost: null,
            tiers: [],
        };
    }

    if (type === "CONTRIBUTION_MARGIN") {
        const contributionRate = getNumberString(formData, "contributionRate");
        const boxFixedCost = getNumberString(formData, "boxFixedCost");

        if (!contributionRate || !boxFixedCost) {
            throw new Error(
                "Bei Deckungsbeitrag müssen Prozent und Box-Fixkosten gesetzt sein."
            );
        }

        return {
            validFrom,
            validTo,
            type,
            fixedAmount: null,
            contributionRate,
            boxFixedCost,
            tiers: [],
        };
    }

    const tierFromValues = formData.getAll("tierFrom");
    const tierToValues = formData.getAll("tierTo");
    const tierAmountValues = formData.getAll("tierAmount");

    const tiers = tierFromValues.map((fromValue, index) => {
        const toValue = tierToValues[index];
        const amountValue = tierAmountValues[index];

        if (
            typeof fromValue !== "string" ||
            typeof toValue !== "string" ||
            typeof amountValue !== "string"
        ) {
            throw new Error("Staffel-Zeile ist ungültig.");
        }

        const fromQuantity = Number(fromValue);
        const toQuantity = Number(toValue);
        const amount = Number(amountValue.replace(",", "."));

        if (
            !Number.isInteger(fromQuantity) ||
            !Number.isInteger(toQuantity) ||
            Number.isNaN(amount)
        ) {
            throw new Error("Staffel-Zeile enthält ungültige Werte.");
        }

        if (fromQuantity <= 0 || toQuantity <= 0) {
            throw new Error("Staffel-Mengen müssen größer als 0 sein.");
        }

        if (fromQuantity > toQuantity) {
            throw new Error("Bei Staffel darf Von nicht größer als Bis sein.");
        }

        if (amount < 0) {
            throw new Error("Beratungshonorar darf nicht negativ sein.");
        }

        return {
            fromQuantity,
            toQuantity,
            amount: amount.toFixed(2),
        };
    });

    if (tiers.length === 0) {
        throw new Error("Bei Staffel muss mindestens eine Staffelzeile existieren.");
    }

    return {
        validFrom,
        validTo,
        type,
        fixedAmount: null,
        contributionRate: null,
        boxFixedCost: null,
        tiers,
    };
}

async function createBrokerFee(brokerId: string, formData: FormData) {
    const feeData = buildFeeData(formData);

    if (!feeData) return;

    await prisma.brokerConsultingFee.create({
        data: {
            brokerId,
            validFrom: feeData.validFrom,
            validTo: feeData.validTo,
            type: feeData.type,
            fixedAmount: feeData.fixedAmount,
            contributionRate: feeData.contributionRate,
            boxFixedCost: feeData.boxFixedCost,
            tiers: {
                create: feeData.tiers,
            },
        },
    });
}

export async function createBroker(formData: FormData) {
    const name = getString(formData, "name");

    if (!name) {
        throw new Error("Name ist Pflicht.");
    }

    const broker = await prisma.broker.create({
        data: {
            tenantId: DEMO_TENANT_ID,

            name,
            type: getString(formData, "type"),
            brokerNumber: getString(formData, "brokerNumber"),
            email: getString(formData, "email"),
            invoiceEmail: getString(formData, "invoiceEmail"),

            notifyNewCustomer: getBoolean(formData, "notifyNewCustomer"),
            notifyApproval: getBoolean(formData, "notifyApproval"),

            iban: getString(formData, "iban"),
            attachmentPassword: getString(formData, "attachmentPassword"),
            comment: getString(formData, "comment"),
            boxCreationMode: getString(formData, "boxCreationMode"),

            title: getString(formData, "title"),
            salutation: getString(formData, "salutation"),
            firstName: getString(formData, "firstName"),
            lastName: getString(formData, "lastName"),
            street: getString(formData, "street"),
            houseNumber: getString(formData, "houseNumber"),
            houseNumberSuffix: getString(formData, "houseNumberSuffix"),
            addressAddition: getString(formData, "addressAddition"),
            addressAddition2: getString(formData, "addressAddition2"),
            zip: getString(formData, "zip"),
            city: getString(formData, "city"),
            country: getString(formData, "country") ?? "DE",

            apiEnabled: getBoolean(formData, "apiEnabled"),
            apiKey: getString(formData, "apiKey"),
            webhookUrl: getString(formData, "webhookUrl"),
            externalPartnerId: getString(formData, "externalPartnerId"),
        },
    });

    await createBrokerFee(broker.id, formData);

    redirect("/app/vermittler");
}

export async function updateBroker(id: string, formData: FormData) {
    const name = getString(formData, "name");

    if (!name) {
        throw new Error("Name ist Pflicht.");
    }

    await prisma.broker.update({
        where: {
            id,
        },
        data: {
            name,
            type: getString(formData, "type"),
            brokerNumber: getString(formData, "brokerNumber"),
            email: getString(formData, "email"),
            invoiceEmail: getString(formData, "invoiceEmail"),

            notifyNewCustomer: getBoolean(formData, "notifyNewCustomer"),
            notifyApproval: getBoolean(formData, "notifyApproval"),

            iban: getString(formData, "iban"),
            attachmentPassword: getString(formData, "attachmentPassword"),
            comment: getString(formData, "comment"),
            boxCreationMode: getString(formData, "boxCreationMode"),

            title: getString(formData, "title"),
            salutation: getString(formData, "salutation"),
            firstName: getString(formData, "firstName"),
            lastName: getString(formData, "lastName"),
            street: getString(formData, "street"),
            houseNumber: getString(formData, "houseNumber"),
            houseNumberSuffix: getString(formData, "houseNumberSuffix"),
            addressAddition: getString(formData, "addressAddition"),
            addressAddition2: getString(formData, "addressAddition2"),
            zip: getString(formData, "zip"),
            city: getString(formData, "city"),
            country: getString(formData, "country") ?? "DE",

            apiEnabled: getBoolean(formData, "apiEnabled"),
            apiKey: getString(formData, "apiKey"),
            webhookUrl: getString(formData, "webhookUrl"),
            externalPartnerId: getString(formData, "externalPartnerId"),
        },
    });

    await prisma.brokerConsultingFee.deleteMany({
        where: {
            brokerId: id,
        },
    });

    await createBrokerFee(id, formData);

    redirect("/app/vermittler");
}

export async function deleteBroker(id: string) {
    await prisma.broker.delete({
        where: {
            id,
        },
    });

    redirect("/app/vermittler");
}