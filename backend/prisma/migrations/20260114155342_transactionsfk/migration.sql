-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `Transactions_account_id_fkey`;

-- AlterTable
ALTER TABLE `cards` ALTER COLUMN `expiry_date` DROP DEFAULT;

-- AlterTable
ALTER TABLE `transactions` ALTER COLUMN `card_id` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
