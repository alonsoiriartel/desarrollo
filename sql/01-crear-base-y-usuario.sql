-- Ejecutar como root en MySQL Workbench o cliente MySQL LOCAL.
-- Contraseña ilustrativa de laboratorio; no utilizar en producción.
CREATE DATABASE IF NOT EXISTS crud_dual
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'crud_user'@'localhost' IDENTIFIED BY 'CrudMysql2026!';
CREATE USER IF NOT EXISTS 'crud_user'@'127.0.0.1' IDENTIFIED BY 'CrudMysql2026!';

-- Desarrollo: TypeORM synchronize necesita permisos DDL.
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX
  ON crud_dual.* TO 'crud_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX
  ON crud_dual.* TO 'crud_user'@'127.0.0.1';

SHOW DATABASES;
