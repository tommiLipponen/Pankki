-- Fix Schema Issues Migration
-- This migration applies the following changes to existing tables:
-- 1. Add unique constraints to account_number and card_number
-- 2. Fix Card.is_locked from DATETIME to BOOLEAN
-- 3. Add Card.expiry_date field
-- 4. Add Transaction.card_id foreign key

-- Step 1: Add unique constraints
ALTER TABLE `accounts` ADD UNIQUE INDEX `accounts_account_number_key`(`account_number`);
ALTER TABLE `cards` ADD UNIQUE INDEX `cards_card_number_key`(`card_number`);

-- Step 2: Fix is_locked type (drop and recreate as BOOLEAN)
ALTER TABLE `cards` MODIFY COLUMN `is_locked` BOOLEAN NOT NULL DEFAULT false;

-- Step 3: Add expiry_date to cards (set default for existing rows)
ALTER TABLE `cards` ADD COLUMN `expiry_date` DATETIME(3) NOT NULL DEFAULT '2030-12-31 23:59:59';

-- Step 4: Add card_id to transactions (requires existing cards, set to 0 temporarily if no cards exist)
-- Warning: This assumes transactions table is empty or you have card data
ALTER TABLE `transactions` ADD COLUMN `card_id` INTEGER NOT NULL DEFAULT 1;

-- Step 5: Add foreign key constraint for card_id
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_card_id_fkey` 
  FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 6: Create indexes for performance
CREATE INDEX `transactions_card_id_idx` ON `transactions`(`card_id`);

-- Step 7: Rename old indexes to match new naming convention
ALTER TABLE `accounts` RENAME INDEX `accounts_customer_id_fkey` TO `accounts_customer_id_idx`;
ALTER TABLE `cards` RENAME INDEX `cards_account_id_fkey` TO `cards_account_id_idx`;
ALTER TABLE `cards` RENAME INDEX `cards_customer_id_fkey` TO `cards_customer_id_idx`;
ALTER TABLE `transactions` RENAME INDEX `Transactions_account_id_fkey` TO `transactions_account_id_idx`;
