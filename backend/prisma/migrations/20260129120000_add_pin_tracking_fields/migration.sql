-- AddColumn: failed_pin_attempts and last_failed_attempt to cards table
ALTER TABLE `cards` ADD COLUMN `failed_pin_attempts` INTEGER NOT NULL DEFAULT 0;
ALTER TABLE `cards` ADD COLUMN `last_failed_attempt` DATETIME(3) NULL;

-- Note: Stored procedure creation removed from migration due to DELIMITER syntax incompatibility
-- Stored procedures must be created manually in production database or through separate SQL script
