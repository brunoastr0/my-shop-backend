-- CreateTable
CREATE TABLE "Client" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- AddForeignKey
ALTER TABLE
    "Client"
ADD
    CONSTRAINT "Client_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE
--     "Client"
-- ADD
--     CONSTRAINT "Client_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE
    "Client" ENABLE ROW LEVEL SECURITY;

CREATE POLICY client_isolation_policy ON "Client" USING (
    tenant_id = current_setting('app.current_tenant_id', TRUE) :: UUID
);