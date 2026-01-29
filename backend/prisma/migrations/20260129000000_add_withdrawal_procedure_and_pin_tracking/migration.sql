-- AddColumn: failed_pin_attempts and last_failed_attempt to cards table
ALTER TABLE `cards` ADD COLUMN `failed_pin_attempts` INTEGER NOT NULL DEFAULT 0;
ALTER TABLE `cards` ADD COLUMN `last_failed_attempt` DATETIME(3) NULL;

-- CreateProcedure: Stored procedure for secure withdrawals with PIN verification
DELIMITER $$

CREATE PROCEDURE `usp_withdraw_money`(
    IN p_account_id INT,
    IN p_card_id INT,
    IN p_pin VARCHAR(4),
    IN p_amount DECIMAL(15,2),
    IN p_card_mode ENUM('DEBIT','CREDIT'),
    IN p_description VARCHAR(255),
    OUT p_success BOOLEAN,
    OUT p_new_balance DECIMAL(15,2),
    OUT p_error_message VARCHAR(255)
)
BEGIN
    DECLARE v_pin_hash VARCHAR(255);
    DECLARE v_current_balance DECIMAL(15,2);
    DECLARE v_credit_limit DECIMAL(15,2);
    DECLARE v_is_locked BOOLEAN;
    DECLARE v_is_active BOOLEAN;
    DECLARE v_account_active BOOLEAN;
    DECLARE v_failed_attempts INT;
    DECLARE v_card_account_id INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_success = FALSE;
        SET p_error_message = 'Database error occurred during withdrawal';
        SET p_new_balance = NULL;
    END;

    -- Initialize output parameters
    SET p_success = FALSE;
    SET p_new_balance = NULL;
    SET p_error_message = NULL;

    -- Start transaction
    START TRANSACTION;

    -- Get card details with row lock
    SELECT pin_hash, is_locked, is_active, failed_pin_attempts, account_id
    INTO v_pin_hash, v_is_locked, v_is_active, v_failed_attempts, v_card_account_id
    FROM cards
    WHERE id = p_card_id
    FOR UPDATE;

    -- Validate card exists
    IF v_pin_hash IS NULL THEN
        SET p_error_message = 'Card not found';
        ROLLBACK;
        LEAVE;
    END IF;

    -- Validate card is active
    IF v_is_active = FALSE THEN
        SET p_error_message = 'Card is not active';
        ROLLBACK;
        LEAVE;
    END IF;

    -- Validate card is not locked
    IF v_is_locked = TRUE THEN
        SET p_error_message = 'Card is locked due to multiple failed PIN attempts';
        ROLLBACK;
        LEAVE;
    END IF;

    -- Validate card belongs to specified account
    IF v_card_account_id != p_account_id THEN
        SET p_error_message = 'Card does not belong to this account';
        ROLLBACK;
        LEAVE;
    END IF;

    -- Note: PIN verification must be done in Node.js with bcrypt
    -- This procedure assumes PIN has already been verified before calling
    -- The p_pin parameter is included for future enhancement if MySQL bcrypt UDF is added

    -- Get account balance with row lock
    SELECT balance, credit_limit, is_active
    INTO v_current_balance, v_credit_limit, v_account_active
    FROM accounts
    WHERE id = p_account_id
    FOR UPDATE;

    -- Validate account exists
    IF v_current_balance IS NULL THEN
        SET p_error_message = 'Account not found';
        ROLLBACK;
        LEAVE;
    END IF;

    -- Validate account is active
    IF v_account_active = FALSE THEN
        SET p_error_message = 'Account is not active';
        ROLLBACK;
        LEAVE;
    END IF;

    -- Validate amount is positive
    IF p_amount <= 0 THEN
        SET p_error_message = 'Withdrawal amount must be positive';
        ROLLBACK;
        LEAVE;
    END IF;

    -- Validate sufficient balance based on card mode
    IF p_card_mode = 'DEBIT' THEN
        IF v_current_balance < p_amount THEN
            SET p_error_message = 'Insufficient balance for debit withdrawal';
            ROLLBACK;
            LEAVE;
        END IF;
    ELSEIF p_card_mode = 'CREDIT' THEN
        IF (v_current_balance - p_amount) < (-1 * v_credit_limit) THEN
            SET p_error_message = 'Insufficient credit limit';
            ROLLBACK;
            LEAVE;
        END IF;
    ELSE
        SET p_error_message = 'Invalid card mode';
        ROLLBACK;
        LEAVE;
    END IF;

    -- Update account balance
    UPDATE accounts
    SET balance = balance - p_amount,
        updated_at = CURRENT_TIMESTAMP(3)
    WHERE id = p_account_id;

    -- Reset failed PIN attempts on successful transaction
    UPDATE cards
    SET failed_pin_attempts = 0,
        last_failed_attempt = NULL,
        updated_at = CURRENT_TIMESTAMP(3)
    WHERE id = p_card_id;

    -- Insert transaction record
    INSERT INTO transactions (account_id, card_id, transaction_type, card_mode, amount, description, created_at)
    VALUES (p_account_id, p_card_id, 'WITHDRAWAL', p_card_mode, p_amount, p_description, CURRENT_TIMESTAMP(3));

    -- Get new balance
    SELECT balance INTO p_new_balance FROM accounts WHERE id = p_account_id;

    -- Success
    SET p_success = TRUE;
    COMMIT;
END$$

DELIMITER ;
