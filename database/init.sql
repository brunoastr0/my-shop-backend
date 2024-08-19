-- Enable the uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--- TABLES ---
CREATE TABLE IF NOT EXISTS tenants (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    store_name VARCHAR(63) NOT NULL UNIQUE,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(64) CHECK (status IN ('active', 'suspended', 'disabled')) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS products (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE
    SET
        NULL,
        product_name VARCHAR(255) NOT NULL,
        sale_price NUMERIC DEFAULT 0,
        quantity INTEGER DEFAULT 0,
        product_description TEXT NOT NULL,
        published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS clients (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE
    SET
        NULL,
        fullname VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone_number VARCHAR(15),
        address TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE
    SET
        NULL,
        order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        total_amount NUMERIC NOT NULL DEFAULT 0,
        status VARCHAR(64) CHECK (status IN ('pending', 'completed', 'canceled')) NOT NULL,
        PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE
    SET
        NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        price NUMERIC NOT NULL,
        PRIMARY KEY (id)
);

-- RLS POLICIES -- 
ALTER TABLE
    tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON tenants USING (
    store_name = current_setting('app.current_tenant_name', TRUE) :: VARCHAR(63)
);

ALTER TABLE
    tenants FORCE ROW LEVEL SECURITY;

ALTER TABLE
    products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS product_isolation_policy ON products;

CREATE POLICY product_isolation_policy ON products USING (
    tenant_id = current_setting('app.current_tenant_id', TRUE) :: UUID
);

ALTER TABLE
    products FORCE ROW LEVEL SECURITY;

ALTER TABLE
    clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY client_isolation_policy ON clients USING (
    tenant_id = current_setting('app.current_tenant_id', TRUE) :: UUID
);

ALTER TABLE
    orders FORCE ROW LEVEL SECURITY;

ALTER TABLE
    orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY order_isolation_policy ON orders USING (
    tenant_id = current_setting('app.current_tenant_id', TRUE) :: UUID
);

ALTER TABLE
    order_items FORCE ROW LEVEL SECURITY;

ALTER TABLE
    order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY order_items_isolation_policy ON order_items USING (
    tenant_id = current_setting('app.current_tenant_id', TRUE) :: UUID
);

ALTER TABLE
    orders FORCE ROW LEVEL SECURITY;

-- INDEXES --
CREATE INDEX idx_tenant_id_published ON products (tenant_id, id, published);

-- CLUSTERS --
CLUSTER products USING idx_tenant_id_published;

-- Permissions --
CREATE USER crud_user WITH PASSWORD 'crud_password';

GRANT CONNECT ON DATABASE "my-shop" TO crud_user;

GRANT USAGE ON SCHEMA public TO crud_user;

GRANT
SELECT
,
INSERT
,
UPDATE
,
    DELETE ON ALL TABLES IN SCHEMA public TO crud_user;

GRANT USAGE,
SELECT
,
UPDATE
    ON ALL SEQUENCES IN SCHEMA public TO crud_user;