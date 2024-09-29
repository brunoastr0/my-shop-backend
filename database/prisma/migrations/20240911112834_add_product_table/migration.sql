-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "product_name" TEXT NOT NULL,
    "sale_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "product_description" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE
    "Product"
ADD
    CONSTRAINT "Product_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE
    "Product" ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    "Product" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS product_isolation_policy ON "Product";

CREATE POLICY product_isolation_policy ON "Product" USING (
    tenant_id = current_setting('app.current_tenant_id', TRUE) :: UUID
);

-- INDEXES --
CREATE INDEX idx_tenant_id_published ON "Product" (tenant_id, id, published);

-- CLUSTERS --
CLUSTER "Product" USING idx_tenant_id_published;