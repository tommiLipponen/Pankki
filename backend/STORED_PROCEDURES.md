# MySQL Stored Procedures

This document describes the stored procedures used in the Bank ATM system and provides instructions for setting them up in your local MySQL Workbench.

## Why Stored Procedures?

Stored procedures are used for critical operations that require **row-level locking** to prevent race conditions. Prisma migrations cannot handle stored procedures with `DELIMITER` syntax, so these must be created manually in each database environment.

---

## 1. Withdrawal Stored Procedure (`usp_withdraw_money`)

### Purpose
Handles ATM withdrawal transactions with atomic operations and row-level locking to prevent concurrent withdrawal race conditions.

### Features
- **Row-level locking**: Uses `SELECT ... FOR UPDATE` to lock account and card rows during transaction
- **Balance validation**: Checks based on card mode (DEBIT: balance ≥ 0, CREDIT: balance ≥ -creditLimit)
- **Card status validation**: Checks if card is locked or inactive
- **Atomic operations**: All updates happen in a single transaction (COMMIT or ROLLBACK)
- **Transaction recording**: Creates a transaction record with balance_after

### Parameters
- `p_account_id` (INT): Account ID to withdraw from
- `p_card_id` (INT): Card ID used for withdrawal
- `p_pin` (VARCHAR(255)): Card PIN (currently unused, validation done in Node.js)
- `p_amount` (DECIMAL(10,2)): Amount to withdraw (positive number)
- `p_card_mode` (ENUM): 'DEBIT' or 'CREDIT'

---

## Installation Instructions for MySQL Workbench

### Step 1: Open MySQL Workbench
1. Launch MySQL Workbench
2. Connect to your local MySQL database
3. Select the `pankki_db` database (or your local database name)

### Step 2: Create the Stored Procedure

Copy and paste the following SQL script into a new query tab:

```sql
-- =============================================
-- Stored Procedure: usp_withdraw_money
-- Description: Handles ATM withdrawal with row-level locking
-- ⚠️ IMPORTANT: Use camelCase column names (Prisma convention)
-- =============================================

DELIMITER $$

CREATE PROCEDURE usp_withdraw_money(
    IN p_account_id INT,
    IN p_card_id INT,
    IN p_pin VARCHAR(255),
    IN p_amount DECIMAL(10,2),
    IN p_card_mode ENUM('DEBIT', 'CREDIT')
)
BEGIN
    DECLARE v_current_balance DECIMAL(10,2);
    DECLARE v_credit_limit DECIMAL(10,2);
    DECLARE v_new_balance DECIMAL(10,2);
    DECLARE v_is_locked BOOLEAN;
    DECLARE v_is_active BOOLEAN;
    DECLARE v_account_is_active BOOLEAN;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    -- Start transaction
    START TRANSACTION;
    
    -- Lock account row for update (prevents concurrent withdrawals)
    -- ⚠️ Use camelCase: creditLimit, isActive (NOT credit_limit, is_active)
    SELECT balance, creditLimit, isActive
    INTO v_current_balance, v_credit_limit, v_account_is_active
    FROM accounts
    WHERE id = p_account_id
    FOR UPDATE;
    
    -- Check if account exists and is active
    IF v_account_is_active IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Account not found';
    END IF;
    
    IF v_account_is_active = FALSE THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Account is not active';
    END IF;
    
    -- Lock card row for update
    -- ⚠️ Use camelCase: accountId, isLocked, isActive
    SELECT isLocked, isActive
    INTO v_is_locked, v_is_active
    FROM cards
    WHERE id = p_card_id AND accountId = p_account_id
    FOR UPDATE;
    
    -- Check if card exists
    IF v_is_locked IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Card not found or does not belong to this account';
    END IF;
    
    -- Check if card is locked
    IF v_is_locked = TRUE THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Card is locked';
    END IF;
    
    -- Check if card is active
    IF v_is_active = FALSE THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Card is not active';
    END IF;
    
    -- Calculate new balance
    SET v_new_balance = v_current_balance - p_amount;
    
    -- Validate balance based on card mode
    IF p_card_mode = 'DEBIT' THEN
        IF v_new_balance < 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Insufficient balance for DEBIT withdrawal';
        END IF;
    ELSEIF p_card_mode = 'CREDIT' THEN
        IF v_new_balance < -v_credit_limit THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Insufficient credit limit for CREDIT withdrawal';
        END IF;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid card mode';
    END IF;
    
    -- Update account balance
    -- ⚠️ Use camelCase: updatedAt (NOT updated_at)
    UPDATE accounts
    SET balance = v_new_balance,
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = p_account_id;
    
    -- Create transaction record
    -- ⚠️ Use camelCase: accountId, cardId, transactionType, cardMode, balanceAfter, createdAt
    INSERT INTO transactions (accountId, cardId, transactionType, cardMode, amount, balanceAfter, createdAt)
    VALUES (p_account_id, p_card_id, 'WITHDRAWAL', p_card_mode, p_amount, v_new_balance, CURRENT_TIMESTAMP);
    
    -- Commit transaction
    COMMIT;
END$$

DELIMITER ;
```

### Step 3: Execute the Script
1. Click the **Execute** button (⚡ lightning bolt icon) or press `Ctrl+Shift+Enter`
2. Check the output panel for success message
3. Verify the stored procedure was created:
   - Navigate to **Schemas** → `pankki_db` → **Stored Procedures**
   - You should see `usp_withdraw_money` listed

### Step 4: Test the Stored Procedure (Optional)

You can test the stored procedure with a sample call:

```sql
-- Test withdrawal (replace with actual IDs from your database)
CALL usp_withdraw_money(1, 1, '', 50.00, 'DEBIT');

-- Check the result
SELECT * FROM transactions WHERE accountId = 1 ORDER BY createdAt DESC LIMIT 1;
SELECT balance FROM accounts WHERE id = 1;
```

---

## Troubleshooting

### Error: "Procedure already exists"
If you need to recreate the procedure, drop it first:
```sql
DROP PROCEDURE IF EXISTS usp_withdraw_money;
```
Then run the CREATE PROCEDURE script again.

### Error: "Unknown database 'pankki_db'"
Make sure you've run the Prisma migrations first:
```bash
cd backend
npx prisma migrate dev
```

### Error: "Table 'accounts' doesn't exist"
Ensure your database schema is up to date. Run Prisma migrations:
```bash
npx prisma migrate dev
```

---

## Production Database

The stored procedure has already been created in the **Azure production database**:
- Server: `pankki-mysql-server.mysql.database.azure.com`
- Database: `pankki_db`

**Note**: The production procedure was created via Azure Data Studio without using `DELIMITER` syntax (not needed in that environment).

---

## Backend Integration

The stored procedure is called from the Node.js backend via:
- **Endpoint**: `POST /api/transactions/withdraw`
- **Service**: `transactionService.withdrawWithStoredProcedure()`
- **Method**: Uses Prisma `$executeRaw` to call the procedure

Example backend call:
```javascript
await prisma.$executeRaw`
  CALL usp_withdraw_money(${accountId}, ${cardId}, '', ${amount}, ${cardMode})
`;
```

---

## Notes for Team

1. **Prisma Limitation**: Stored procedures cannot be added via Prisma migrations due to `DELIMITER` syntax incompatibility. They must be created manually in each environment.

2. **Local Development**: Each developer needs to run this script in their local MySQL database after setting up the project.

3. **Version Control**: This file serves as the source of truth for stored procedure definitions. If the procedure is updated, update this file and notify the team.

4. **Race Condition Prevention**: The stored procedure uses `FOR UPDATE` locking, which is critical for preventing balance inconsistencies during concurrent withdrawals. Do not bypass this by using the generic transaction endpoint for withdrawals.

---

## Future Stored Procedures

As the project grows, additional stored procedures may be added here. Follow the same manual installation process for each environment.
