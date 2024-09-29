-- DropForeignKey
ALTER TABLE
    "Order" DROP CONSTRAINT "Order_client_id_fkey";

-- DropForeignKey
ALTER TABLE
    "OrderItem" DROP CONSTRAINT "OrderItem_order_id_fkey";

-- DropForeignKey
ALTER TABLE
    "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- AlterTable
ALTER TABLE
    "Order"
ALTER COLUMN
    "client_id"
SET
    DATA TYPE UUID;

-- AlterTable
ALTER TABLE
    "OrderItem"
ALTER COLUMN
    "order_id"
SET
    DATA TYPE UUID,
ALTER COLUMN
    "product_id"
SET
    DATA TYPE UUID;

-- AddForeignKey
ALTER TABLE
    "Order"
ADD
    CONSTRAINT "Order_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "OrderItem"
ADD
    CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "OrderItem"
ADD
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;