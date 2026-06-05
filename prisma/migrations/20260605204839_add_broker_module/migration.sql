-- CreateTable
CREATE TABLE "Broker" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "brokerNumber" TEXT,
    "email" TEXT,
    "invoiceEmail" TEXT,
    "notifyNewCustomer" BOOLEAN NOT NULL DEFAULT false,
    "notifyApproval" BOOLEAN NOT NULL DEFAULT false,
    "iban" TEXT,
    "attachmentPassword" TEXT,
    "comment" TEXT,
    "boxCreationMode" TEXT,
    "title" TEXT,
    "salutation" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "street" TEXT,
    "houseNumber" TEXT,
    "houseNumberSuffix" TEXT,
    "addressAddition" TEXT,
    "addressAddition2" TEXT,
    "zip" TEXT,
    "city" TEXT,
    "country" TEXT DEFAULT 'DE',
    "apiEnabled" BOOLEAN NOT NULL DEFAULT false,
    "apiKey" TEXT,
    "webhookUrl" TEXT,
    "externalPartnerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Broker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrokerConsultingFee" (
    "id" TEXT NOT NULL,
    "brokerId" TEXT NOT NULL,
    "validFrom" TEXT NOT NULL,
    "validTo" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fixedAmount" DECIMAL(10,2),
    "contributionRate" DECIMAL(10,2),
    "boxFixedCost" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrokerConsultingFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrokerConsultingFeeTier" (
    "id" TEXT NOT NULL,
    "feeId" TEXT NOT NULL,
    "fromQuantity" INTEGER NOT NULL,
    "toQuantity" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "BrokerConsultingFeeTier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Broker_tenantId_idx" ON "Broker"("tenantId");

-- CreateIndex
CREATE INDEX "Broker_name_idx" ON "Broker"("name");

-- CreateIndex
CREATE INDEX "Broker_brokerNumber_idx" ON "Broker"("brokerNumber");

-- CreateIndex
CREATE INDEX "BrokerConsultingFee_brokerId_idx" ON "BrokerConsultingFee"("brokerId");

-- CreateIndex
CREATE INDEX "BrokerConsultingFeeTier_feeId_idx" ON "BrokerConsultingFeeTier"("feeId");

-- AddForeignKey
ALTER TABLE "BrokerConsultingFee" ADD CONSTRAINT "BrokerConsultingFee_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "Broker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrokerConsultingFeeTier" ADD CONSTRAINT "BrokerConsultingFeeTier_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "BrokerConsultingFee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
