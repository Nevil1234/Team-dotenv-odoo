-- CreateEnum
CREATE TYPE "public"."UserProductInteraction" AS ENUM ('FAVORITE', 'CART', 'VIEWED', 'WISHLIST');

-- CreateTable
CREATE TABLE "public"."UserProduct" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "interaction" "public"."UserProductInteraction" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER,
    "notes" TEXT,

    CONSTRAINT "UserProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserProduct_userId_idx" ON "public"."UserProduct"("userId");

-- CreateIndex
CREATE INDEX "UserProduct_productId_idx" ON "public"."UserProduct"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProduct_userId_productId_interaction_key" ON "public"."UserProduct"("userId", "productId", "interaction");

-- AddForeignKey
ALTER TABLE "public"."UserProduct" ADD CONSTRAINT "UserProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProduct" ADD CONSTRAINT "UserProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
