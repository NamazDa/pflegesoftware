-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('OPEN', 'APPROVED', 'REJECTED', 'NO_RESPONSE', 'FAILED', 'DELETED');

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "customerNumber" TEXT,
    "type" TEXT NOT NULL,
    "status" "QuoteStatus" NOT NULL,
    "insuranceName" TEXT,
    "processNumber" TEXT,
    "approvalNumber" TEXT,
    "approvalDate" TIMESTAMP(3),
    "approvedFrom" TIMESTAMP(3),
    "approvedUntil" TIMESTAMP(3),
    "copaymentFree" BOOLEAN,
    "rejectionReason" TEXT,
    "pdfUrl" TEXT,
    "brokerName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
