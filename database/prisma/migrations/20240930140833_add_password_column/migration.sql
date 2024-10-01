/*
 Warnings:
 
 - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
 
 */
-- DropForeignKey
ALTER TABLE
  "Client" DROP CONSTRAINT "Client_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE
  "Order" DROP CONSTRAINT "Order_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE
  "OrderItem" DROP CONSTRAINT "OrderItem_order_id_fkey";

-- DropForeignKey
ALTER TABLE
  "OrderItem" DROP CONSTRAINT "OrderItem_product_id_fkey";

-- DropForeignKey
ALTER TABLE
  "OrderItem" DROP CONSTRAINT "OrderItem_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE
  "Product" DROP CONSTRAINT "Product_tenant_id_fkey";

-- AlterTable
ALTER TABLE
  "User"
ADD
  COLUMN "password" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE
  "Product"
ADD
  CONSTRAINT "Product_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "Client"
ADD
  CONSTRAINT "Client_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "Order"
ADD
  CONSTRAINT "Order_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "OrderItem"
ADD
  CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "OrderItem"
ADD
  CONSTRAINT "OrderItem_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "OrderItem"
ADD
  CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;