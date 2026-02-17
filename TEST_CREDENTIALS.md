# ATM Test Credentials - Frontend Testing

## ✅ WORKING CARDS

### 1. Matti Meikäläinen - DEBIT Only
- **Card**: 1234567890123456
- **PIN**: 1234
- **Modes**: DEBIT only
- **Balance**: €1,500.00
- **Credit**: €0
- **Status**: Active, unlocked

### 2. Matti Meikäläinen - DEBIT + CREDIT
- **Card**: 1234567890123457
- **PIN**: 1234
- **Modes**: DEBIT or CREDIT
- **Balance**: €500.00
- **Credit Limit**: €1,000.00
- **Status**: Active, unlocked

### 3. Liisa Virtanen - DEBIT Only
- **Card**: 2345678901234567
- **PIN**: 1234
- **Modes**: DEBIT only
- **Balance**: €3,200.50
- **Credit**: €0
- **Status**: Active, unlocked

### 4. Jukka Korhonen - DEBIT Only
- **Card**: 3456789012345678
- **PIN**: 1234
- **Modes**: DEBIT only
- **Balance**: €750.25
- **Credit**: €0
- **Status**: Active, unlocked

### 5. Anna Nieminen - DEBIT + CREDIT
- **Card**: 4567890123456789
- **PIN**: 5678
- **Modes**: DEBIT or CREDIT
- **Balance**: €2,100.00
- **Credit Limit**: €2,000.00
- **Status**: Active, unlocked

### 6. Mikko Mäkinen - DEBIT Only
- **Card**: 5678901234567890
- **PIN**: 5678
- **Modes**: DEBIT only
- **Balance**: €450.75
- **Credit**: €0
- **Status**: Active, unlocked

---

## ❌ ERROR TEST CARDS

### 7. LOCKED Card (Failed PIN Attempts)
- **Card**: 2345678901234568
- **PIN**: 1234 (won't work - card is locked)
- **Customer**: Liisa Virtanen
- **Error**: "Card is locked due to multiple failed PIN attempts"
- **Failed Attempts**: 3

### 8. EXPIRED Card
- **Card**: 3456789012345679
- **PIN**: 1234 (won't work - card expired)
- **Customer**: Jukka Korhonen
- **Error**: "Card is expired"

### 9. INACTIVE Card (Deactivated)
- **Card**: 4567890123456790
- **PIN**: 5678 (won't work - card inactive)
- **Customer**: Anna Nieminen
- **Error**: "Card is inactive"

### 10. LOCKED Card (Fraud)
- **Card**: 5678901234567891
- **PIN**: 5678 (won't work - locked for fraud)
- **Customer**: Mikko Mäkinen
- **Error**: "Card is locked due to multiple failed PIN attempts"
- **Failed Attempts**: 3

---

## 🧪 TESTING SCENARIOS

### Test Successful Login
```
Card: 1234567890123456
PIN: 1234
Mode: DEBIT
```

### Test Dual-Mode Card
```
Card: 1234567890123457
PIN: 1234
Mode: DEBIT or CREDIT
```

### Test Wrong PIN (triggers attempt counter)
```
Card: 1234567890123456
PIN: 0000 (wrong)
Expected: 401 error with "Invalid PIN. X attempts remaining."
```

### Test Locked Card
```
Card: 2345678901234568
PIN: 1234
Expected: 401 error with "Card is locked due to multiple failed PIN attempts"
```

### Test Expired Card
```
Card: 3456789012345679
PIN: 1234
Expected: 404 error with "Card is expired"
```

### Test Inactive Card
```
Card: 4567890123456790
PIN: 5678
Expected: 404 error with "Card is inactive"
```

---

## 📝 QUICK REFERENCE TABLE

| Card Number      | PIN  | Customer | Mode         | Balance   | Credit    | Status          |
|------------------|------|----------|--------------|-----------|-----------|-----------------|
| 1234567890123456 | 1234 | Matti    | DEBIT        | €1,500.00 | €0        | ✅ Active       |
| 1234567890123457 | 1234 | Matti    | DEBIT+CREDIT | €500.00   | €1,000.00 | ✅ Active       |
| 2345678901234567 | 1234 | Liisa    | DEBIT        | €3,200.50 | €0        | ✅ Active       |
| 3456789012345678 | 1234 | Jukka    | DEBIT        | €750.25   | €0        | ✅ Active       |
| 4567890123456789 | 5678 | Anna     | DEBIT+CREDIT | €2,100.00 | €2,000.00 | ✅ Active       |
| 5678901234567890 | 5678 | Mikko    | DEBIT        | €450.75   | €0        | ✅ Active       |
| 2345678901234568 | 1234 | Liisa    | DEBIT+CREDIT | -€250.00  | €500.00   | ❌ Locked       |
| 3456789012345679 | 1234 | Jukka    | DEBIT        | €750.25   | €0        | ❌ Expired      |
| 4567890123456790 | 5678 | Anna     | DEBIT+CREDIT | €2,100.00 | €2,000.00 | ❌ Inactive     |
| 5678901234567891 | 5678 | Mikko    | DEBIT        | €450.75   | €0        | ❌ Locked       |

---

