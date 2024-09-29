CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "Tenant" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "tenant_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE
    "User"
ADD
    CONSTRAINT "User_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

--- Enable RLS on the User table
ALTER TABLE
    "User" ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    "User" FORCE ROW LEVEL SECURITY;

--- Create a policy for tenant isolation
DROP POLICY IF EXISTS tenant_isolation_policy ON "User";

CREATE POLICY tenant_isolation_policy ON "User" USING (
    "tenant_id" = current_setting('app.current_tenant_id') :: UUID
);

---Create a bypass RLS policy (for admin purposes)
CREATE POLICY bypass_rls_policy ON "User" USING (
    current_setting('app.bypass_rls', true) :: text = 'on'
);