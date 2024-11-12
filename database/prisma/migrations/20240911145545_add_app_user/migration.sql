-- DO $$ BEGIN IF EXISTS (
--     SELECT
--     FROM
--         pg_catalog.pg_roles
--     WHERE
--         rolname = 'shop_user'
-- ) THEN RAISE NOTICE 'Role "shop_user" already exists. Skipping.';
-- ELSE CREATE ROLE shop_user LOGIN PASSWORD 'shop_password';
-- GRANT USAGE ON SCHEMA public TO shop_user;
-- GRANT
-- SELECT
-- ,
-- INSERT
-- ,
-- UPDATE
-- ,
--     DELETE ON ALL TABLES IN SCHEMA public TO shop_user;
-- GRANT USAGE,
-- SELECT
-- ,
-- UPDATE
--     ON ALL SEQUENCES IN SCHEMA public TO shop_user;
-- END IF;
-- END $ $;
-- Permissions --
DROP USER IF EXISTS shop_user;

-- CREATE ROLE app_user LOGIN PASSWORD ‘your_password’;
CREATE ROLE shop_user LOGIN PASSWORD 'shop_password';

GRANT CONNECT ON DATABASE "my-shop" TO shop_user;

GRANT USAGE ON SCHEMA public TO shop_user;

GRANT
SELECT
,
INSERT
,
UPDATE
,
    DELETE ON ALL TABLES IN SCHEMA public TO shop_user;

GRANT USAGE,
SELECT
,
UPDATE
    ON ALL SEQUENCES IN SCHEMA public TO shop_user;