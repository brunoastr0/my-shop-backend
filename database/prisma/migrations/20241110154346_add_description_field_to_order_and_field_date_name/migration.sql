/*
 Warnings:
 
 - You are about to drop the column `order_date` on the `Order` table. All the data in the column will be lost.
 - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - Added the required column `due_date` to the `Order` table without a default value. This is not possible if the table is not empty.
 - Changed the type of `id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
 
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

-- DropForeignKey
ALTER TABLE
  "User" DROP CONSTRAINT "User_tenant_id_fkey";

-- AlterTable
ALTER TABLE
  "Order" DROP COLUMN "order_date",
ADD
  COLUMN "description" TEXT,
ADD
  COLUMN "due_date" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE
  "User"
ADD
  CONSTRAINT "User_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "Product"
ADD
  CONSTRAINT "Product_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "Client"
ADD
  CONSTRAINT "Client_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "Order"
ADD
  CONSTRAINT "Order_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "OrderItem"
ADD
  CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "OrderItem"
ADD
  CONSTRAINT "OrderItem_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "OrderItem"
ADD
  CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;