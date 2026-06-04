-- CreateTable
CREATE TABLE "CostCarrier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ikNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostCarrier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CostCarrier_ikNumber_key" ON "CostCarrier"("ikNumber");
