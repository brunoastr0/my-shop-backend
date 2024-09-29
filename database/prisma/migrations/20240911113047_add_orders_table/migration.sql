-- CreateTable
CREATE TABLE "Order" (
    "id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL,
    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE
    "Order"
ADD
    CONSTRAINT "Order_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "Order"
ADD
    CONSTRAINT "Order_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE
    "Order" ENABLE ROW LEVEL SECURITY;

CREATE POLICY order_isolation_policy ON "Order" USING (
    "tenant_id" = current_setting('app.current_tenant_id', TRUE) :: UUID
);

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
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE
SET
    NULL ON UPDATE CASCADE;

ALTER TABLE
    "OrderItem" ENABLE ROW LEVEL SECURITY;

CREATE POLICY order_items_isolation_policy ON "OrderItem" USING (
    "tenant_id" = current_setting('app.current_tenant_id', TRUE) :: UUID
);