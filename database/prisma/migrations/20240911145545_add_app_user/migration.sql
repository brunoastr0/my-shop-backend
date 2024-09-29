-- Permissions --
-- DROP USER IF EXISTS shop_user;
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