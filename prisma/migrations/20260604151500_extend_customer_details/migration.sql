-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "brokerName" TEXT,
ADD COLUMN     "brokerNumber" TEXT,
ADD COLUMN     "brokerShop" TEXT,
ADD COLUMN     "careLevel" INTEGER,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT DEFAULT 'DE',
ADD COLUMN     "houseNumber" TEXT,
ADD COLUMN     "houseNumberSuffix" TEXT,
ADD COLUMN     "insuranceIk" TEXT,
ADD COLUMN     "insuranceName" TEXT,
ADD COLUMN     "insuranceType" TEXT,
ADD COLUMN     "pg51Status" TEXT,
ADD COLUMN     "pg54Status" TEXT,
ADD COLUMN     "street" TEXT,
ADD COLUMN     "zip" TEXT;

-- CreateIndex
CREATE INDEX "Customer_insuranceName_idx" ON "Customer"("insuranceName");

-- CreateIndex
CREATE INDEX "Customer_brokerName_idx" ON "Customer"("brokerName");
