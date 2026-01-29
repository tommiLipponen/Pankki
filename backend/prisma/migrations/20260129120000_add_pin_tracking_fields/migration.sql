-- AddColumn: failed_pin_attempts and last_failed_attempt to cards table (if not exists)
-- Note: Columns may already exist from previous failed migration attempt

SET @col_exists_failed_attempts = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'cards' 
    AND COLUMN_NAME = 'failed_pin_attempts'
);

SET @col_exists_last_failed = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'cards' 
    AND COLUMN_NAME = 'last_failed_attempt'
);

SET @sql_failed_attempts = IF(@col_exists_failed_attempts = 0, 
    'ALTER TABLE `cards` ADD COLUMN `failed_pin_attempts` INTEGER NOT NULL DEFAULT 0', 
    'SELECT "Column failed_pin_attempts already exists"'
);

SET @sql_last_failed = IF(@col_exists_last_failed = 0, 
    'ALTER TABLE `cards` ADD COLUMN `last_failed_attempt` DATETIME(3) NULL', 
    'SELECT "Column last_failed_attempt already exists"'
);

PREPARE stmt1 FROM @sql_failed_attempts;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;

PREPARE stmt2 FROM @sql_last_failed;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- Note: Stored procedure creation removed from migration due to DELIMITER syntax incompatibility
-- Stored procedures must be created manually in production database or through separate SQL script
