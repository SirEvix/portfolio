-- SQL schema for relics table (MySQL)
-- Create the database first (adjust name as needed):
-- CREATE DATABASE IF NOT EXISTS relics_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE relics_db;

CREATE TABLE IF NOT EXISTS `relics` (
  `id` INT NOT NULL PRIMARY KEY,
  `token_hash` CHAR(64) DEFAULT NULL,
  `internal_code_hash` CHAR(64) DEFAULT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'dormant',
  `owner_name` VARCHAR(15) DEFAULT NULL,
  `owner_date` DATETIME DEFAULT NULL,
  INDEX `idx_token_hash` (`token_hash`),
  INDEX `idx_internal_code_hash` (`internal_code_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
