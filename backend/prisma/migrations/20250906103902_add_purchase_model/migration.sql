-- CreateEnum
CREATE TYPE "public"."ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SOLD', 'PENDING');

-- CreateEnum
CREATE TYPE "public"."PurchaseStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED');

-- DropIndex
DROP INDEX "public"."Product_sellerId_idx";

-- CreateTable
CREATE TABLE "public"."ProductList" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "category" "public"."ProductCategory" NOT NULL,
    "status" "public"."ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "productId" INTEGER NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Purchase" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceAtPurchase" DECIMAL(10,2) NOT NULL,
    "status" "public"."PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductList_productId_key" ON "public"."ProductList"("productId");

-- CreateIndex
CREATE INDEX "ProductList_sellerId_idx" ON "public"."ProductList"("sellerId");

-- CreateIndex
CREATE INDEX "ProductList_productId_idx" ON "public"."ProductList"("productId");

-- CreateIndex
CREATE INDEX "Purchase_userId_idx" ON "public"."Purchase"("userId");

-- CreateIndex
CREATE INDEX "Purchase_productId_idx" ON "public"."Purchase"("productId");

-- AddForeignKey
ALTER TABLE "public"."ProductList" ADD CONSTRAINT "ProductList_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductList" ADD CONSTRAINT "ProductList_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchase" ADD CONSTRAINT "Purchase_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
