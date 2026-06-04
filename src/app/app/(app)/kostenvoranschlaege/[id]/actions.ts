"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function approveQuote(formData: FormData) {
    const id = String(formData.get("id"))

    await prisma.quote.update({
        where: { id },
        data: {
            status: "APPROVED",
            approvalDate: new Date(),
            approvedFrom: new Date(),
            approvedUntil: new Date(
                new Date().setMonth(new Date().getMonth() + 12)
            ),
        },
    })

    revalidatePath("/app/kostenvoranschlaege")
    revalidatePath(`/app/kostenvoranschlaege/${id}`)
}

export async function rejectQuote(formData: FormData) {
    const id = String(formData.get("id"))
    const reason = String(formData.get("reason") || "Keine Begründung angegeben")

    await prisma.quote.update({
        where: { id },
        data: {
            status: "REJECTED",
            rejectionReason: reason,
        },
    })

    revalidatePath("/app/kostenvoranschlaege")
    revalidatePath(`/app/kostenvoranschlaege/${id}`)
}