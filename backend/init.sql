-- Create user if not exists
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'user') THEN
      CREATE USER "user" WITH PASSWORD 'password';
   END IF;
END
$do$;

-- Create database if not exists
SELECT 'CREATE DATABASE userdb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'userdb');

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE userdb TO "user";
ALTER USER "user" CREATEDB; 