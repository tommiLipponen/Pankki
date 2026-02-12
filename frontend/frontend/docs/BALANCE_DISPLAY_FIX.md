# Balance Display Fix: Debit vs Credit Mode

## Issue Description

**Problem:** When switching between DEBIT and CREDIT card modes for the same card, the displayed balance appeared to be identical (e.g., 2090 EUR for both modes), which confused users into thinking the system wasn't tracking balances correctly.

**Example Scenario:**
1. Login with card `4567890123456789` in DEBIT mode
2. Account balance: 2100 EUR
3. Withdraw 10 EUR → New balance: 2090 EUR ✅
4. Logout and login again with same card in CREDIT mode
5. Displayed balance: 2090 EUR (same as debit) ❓

## Root Cause Analysis

### Database Design (Intentional)

The system uses a **single shared account balance** for both DEBIT and CREDIT modes:

```sql
ACCOUNTS table:
  - balance: DECIMAL(15,2)      -- Shared balance for both modes
  - creditLimit: DECIMAL(15,2)  -- Extra spending power for CREDIT mode
```

**How it works:**
- **DEBIT mode**: Can only spend positive balance (`balance ≥ 0`)
- **CREDIT mode**: Can spend into negative (`balance ≥ -creditLimit`)

**Example:**
```
Account balance: 2090 EUR
Credit limit: 5000 EUR

DEBIT mode available:  2090 EUR (only positive balance)
CREDIT mode available: 7090 EUR (balance + credit limit)
```

### The UI/UX Issue

**Before fix:**
- Both modes displayed the same raw account balance: `2090€`
- Users couldn't see the difference between DEBIT and CREDIT

**After fix:**
- DEBIT mode shows: `2090€` (only account balance)
- CREDIT mode shows: `7090€ (incl. credit)` (balance + credit limit)

## Solution Implementation

### 1. Updated `onVerifyPinSuccess()` - Line 522

**Added logic to calculate available balance based on card mode:**

```cpp
QString displayBalance;
if (cardMode == "CREDIT") {
    // CREDIT mode: show total available (balance + credit limit)
    double balanceValue = balance.toDouble();
    double creditValue = creditLimit.toDouble();
    double availableCredit = balanceValue + creditValue;
    displayBalance = QString::number(availableCredit, 'f', 2) + "€ (incl. credit)";
} else {
    // DEBIT mode: show only account balance
    displayBalance = balance + "€";
}

ui->balanceLabel->setText(displayBalance);
```

### 2. Updated `onWithdrawSuccess()` - Line 697

**Fixed balance display after withdrawals:**

```cpp
// Calculate available balance for display
double balanceValue = balance.toDouble();
double creditValue = creditLimit.toDouble();
QString displayBalance;
if (cardMode == "CREDIT") {
    double availableCredit = balanceValue + creditValue;
    displayBalance = QString::number(availableCredit, 'f', 2) + "€ (incl. credit)";
} else {
    displayBalance = balance + "€";
}

// Show detailed confirmation message
QString successMessage = "Withdrawal successful!\n\nAmount: €" + amount + 
    "\nNew account balance: €" + newBalance;
if (cardMode == "CREDIT") {
    successMessage += "\nAvailable credit: €" + QString::number(balanceValue + creditValue, 'f', 2);
}
QMessageBox::information(this, "Success", successMessage);
```

### 3. Updated `onBalanceClicked()` - Line 597

**Fixed balance page display:**

```cpp
QString displayBalance;
if (cardMode == "CREDIT") {
    double balanceValue = balance.toDouble();
    double creditValue = creditLimit.toDouble();
    double availableCredit = balanceValue + creditValue;
    displayBalance = QString::number(availableCredit, 'f', 2) + "€ (incl. credit)";
} else {
    displayBalance = balance + "€";
}

ui->balancePageLabel->setText(displayBalance);
```

### 4. Enhanced `resetSession()` - Line 262

**Properly clear all session data:**

```cpp
balance.clear();
creditLimit.clear();
cardMode.clear();
accountId.clear();
accountNumber.clear();
username.clear();
customerId.clear();
```

## Testing Scenarios

### Test Case 1: DEBIT Mode
1. Login with card `4567890123456789` in DEBIT mode
2. Account balance: 2100 EUR, Credit limit: 5000 EUR
3. Expected display: `2100€`
4. Withdraw 10 EUR
5. Expected display: `2090€` ✅

### Test Case 2: CREDIT Mode
1. Login with card `4567890123456789` in CREDIT mode
2. Account balance: 2090 EUR, Credit limit: 5000 EUR
3. Expected display: `7090€ (incl. credit)` ✅
4. Withdraw 100 EUR
5. Expected display: `6990€ (incl. credit)` ✅

### Test Case 3: Mode Switching
1. Login DEBIT → Display: `2090€`
2. Logout
3. Login CREDIT → Display: `7090€ (incl. credit)` ✅
4. Logout
5. Login DEBIT → Display: `2090€` ✅

### Test Case 4: Negative Balance in CREDIT
1. Login CREDIT mode with balance: -500 EUR, Credit limit: 5000 EUR
2. Expected display: `4500€ (incl. credit)` ✅
3. Withdraw 1000 EUR
4. Expected display: `3500€ (incl. credit)` ✅
5. DEBIT mode would show: `-1500€` (and prevent withdrawal) ✅

## Key Improvements

1. **Clarity:** Users now immediately see the difference between DEBIT and CREDIT
2. **Accuracy:** Display reflects actual available spending power
3. **Transparency:** Confirmation dialogs show both account balance and available credit
4. **Consistency:** All pages (Dashboard, Balance, Withdraw) use same logic
5. **Session Management:** Proper cleanup prevents stale data

## Backend Behavior (Unchanged)

The backend already handles this correctly:
- Stores single account balance
- Validates withdrawals based on card mode:
  - DEBIT: `newBalance >= 0`
  - CREDIT: `newBalance >= -creditLimit`
- Returns correct balance after transactions

**No backend changes needed** - this was purely a frontend display issue.

## Related Files

- `frontend/mainwindow.cpp` - All balance display logic
- `frontend/mainwindow.h` - Member variables: `balance`, `creditLimit`, `cardMode`
- `backend/src/services/authService.js` - Returns balance and creditLimit
- `backend/STORED_PROCEDURES.md` - Withdrawal validation logic

## Future Enhancements

1. Add visual indicators (icons) for DEBIT vs CREDIT mode
2. Show credit utilization percentage in CREDIT mode
3. Add warning when approaching credit limit
4. Display separate "Account Balance" and "Available Credit" labels
