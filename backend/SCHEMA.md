# Bank ATM Database Schema

Complete database structure for the Bank ATM system with dual debit/credit card functionality.

```
╔════════════════════════════════════════════════════════════════════════════╗
║                        BANK ATM DATABASE SCHEMA                            ║
║                     (Single Account, Dual Card Mode)                       ║
╚════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────┐
│          CUSTOMERS                  │
├─────────────────────────────────────┤
│ 🔑 id (PK)           INT            │
│    firstName         VARCHAR(100)   │
│    lastName          VARCHAR(100)   │
│    address           VARCHAR(255)   │
│    createdAt         DATETIME       │
│    updatedAt         DATETIME       │
└─────────────────────────────────────┘
         │
         │ Has many accounts
         │ Has many cards
         ▼

┌─────────────────────────────────────┐
│          ACCOUNTS                   │
├─────────────────────────────────────┤
│ 🔑 id (PK)           INT            │
│    accountNumber     VARCHAR(20)    │ UNIQUE
│    balance           DECIMAL(15,2)  │
│    creditLimit       DECIMAL(15,2)  │ DEFAULT 0
│ 🔗 customerId (FK)   INT            │ → customers.id, CASCADE
│    isActive          BOOLEAN        │ DEFAULT true
│    createdAt         DATETIME       │
│    updatedAt         DATETIME       │
└─────────────────────────────────────┘
         │
         │ Has many cards
         │ Has many transactions
         ▼

┌─────────────────────────────────────┐
│          CARDS                      │
├─────────────────────────────────────┤
│ 🔑 id (PK)           INT            │
│    cardNumber        VARCHAR(16)    │ UNIQUE (16 digits)
│    pinHash           VARCHAR(255)   │ (Hashed 4-digit PIN)
│ 🔗 customerId (FK)   INT            │ → customers.id, CASCADE
│ 🔗 accountId (FK)    INT            │ → accounts.id, CASCADE
│    isLocked          BOOLEAN        │ DEFAULT false
│    isActive          BOOLEAN        │ DEFAULT true
│    expiryDate        DATETIME       │
│    createdAt         DATETIME       │
│    updatedAt         DATETIME       │
└─────────────────────────────────────┘
         │
         │ Creates transactions
         ▼

┌─────────────────────────────────────┐
│          TRANSACTIONS               │
├─────────────────────────────────────┤
│ 🔑 id (PK)           INT            │
│ 🔗 accountId (FK)    INT            │ → accounts.id, CASCADE
│    transactionType   ENUM           │ (DEPOSIT, WITHDRAWAL, etc.)
│    cardMode          ENUM           │ (DEBIT, CREDIT)
│    amount            DECIMAL(15,2)  │
│    balanceAfter      DECIMAL(15,2)  │
│    description       VARCHAR(255)   │ NULLABLE
│    createdAt         DATETIME       │
└─────────────────────────────────────┘


╔════════════════════════════════════════════════════════════════════════════╗
║                              ENUMS                                         ║
╚════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────┐
│     TransactionType                 │
├─────────────────────────────────────┤
│  • DEPOSIT                          │
│  • WITHDRAWAL                       │
│  • TRANSFER_IN                      │
│  • TRANSFER_OUT                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│     CardMode                        │
├─────────────────────────────────────┤
│  • DEBIT   (balance can't go < 0)   │
│  • CREDIT  (balance can go negative)│
└─────────────────────────────────────┘


╔════════════════════════════════════════════════════════════════════════════╗
║                         RELATIONSHIPS                                      ║
╚════════════════════════════════════════════════════════════════════════════╝

Customer ──< Account     (One customer has many accounts)
Customer ──< Card        (One customer has many cards)
Account  ──< Card        (One account has many cards)
Account  ──< Transaction (One account has many transactions)

⚠️  All foreign keys use CASCADE deletion for easy testing in Swagger


╔════════════════════════════════════════════════════════════════════════════╗
║                         KEY CONCEPTS                                       ║
╚════════════════════════════════════════════════════════════════════════════╝

📌 ONE PHYSICAL CARD = ONE DATABASE CARD RECORD
   └─> Linked to ONE account
   └─> User selects mode at ATM (DEBIT or CREDIT)

📌 DEBIT MODE:
   ✅ Withdrawal allowed if: balance - amount >= 0
   ❌ Can't go negative

📌 CREDIT MODE:
   ✅ Withdrawal allowed if: balance - amount >= -creditLimit
   ✅ Can go negative (overdraft/credit)

📌 EXAMPLE:
   Account: balance = €1,000, creditLimit = €500
   
   Debit Mode:
   ✅ Withdraw €800  → New balance: €200 (OK)
   ❌ Withdraw €1,200 → REJECTED (would be -€200)
   
   Credit Mode:
   ✅ Withdraw €800  → New balance: €200 (OK)
   ✅ Withdraw €1,200 → New balance: -€200 (OK, within -€500 limit)
   ❌ Withdraw €1,600 → REJECTED (would be -€600, exceeds -€500 limit)


╔════════════════════════════════════════════════════════════════════════════╗
║                    IMPLEMENTATION TIMELINE                                 ║
╚════════════════════════════════════════════════════════════════════════════╝

✅ Week 2 (Done):        customers
🔨 Week 3 (In Progress): accounts, cards (with pinHash), transactions
🔐 Week 4 (Planned):     Implement JWT auth (hash PINs, verify, generate tokens)


╔════════════════════════════════════════════════════════════════════════════╗
║                    DATABASE COLUMN MAPPING                                 ║
╚════════════════════════════════════════════════════════════════════════════╝

Prisma (Code)          →  MySQL (Database)
─────────────────────────────────────────────
id                     →  id
firstName              →  first_name
lastName               →  last_name
createdAt              →  created_at
updatedAt              →  updated_at
accountNumber          →  account_number
creditLimit            →  credit_limit
customerId             →  customer_id
isActive               →  is_active
cardNumber             →  card_number
pinHash                →  pin_hash
accountId              →  account_id
isLocked               →  is_locked
expiryDate             →  expiry_date
transactionType        →  transaction_type
cardMode               →  card_mode
balanceAfter           →  balance_after

Table Names:           →  All lowercase
Customer               →  customers
Account                →  accounts
Card                   →  cards
Transaction            →  transactions


╔════════════════════════════════════════════════════════════════════════════╗
║                         PRISMA PATTERNS                                    ║
╚════════════════════════════════════════════════════════════════════════════╝

Primary Key:
  id Int @id @default(autoincrement())

Foreign Key with Cascade:
  customerId Int @map("customer_id")
  customer Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)

Unique Constraint:
  cardNumber String @unique @map("card_number") @db.VarChar(16)

Default Values:
  isActive Boolean @default(true) @map("is_active")
  creditLimit Decimal @default(0) @map("credit_limit") @db.Decimal(15, 2)

Timestamps:
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

Money Fields:
  balance Decimal @db.Decimal(15, 2)

Enums:
  enum CardMode {
    DEBIT
    CREDIT
  }
  cardMode CardMode @map("card_mode")

Table Name Mapping:
  @@map("lowercase_table_name")
```

---

## Implementation Checklist

### Week 3 Tasks:

- [ ] **Accounts Table**
  - [ ] Add model to schema.prisma
  - [ ] Run migration
  - [ ] Create accountService.js
  - [ ] Create accountRoutes.js
  - [ ] Test all CRUD endpoints in Swagger
  - [ ] Verify cascade deletion

- [ ] **Cards Table**
  - [ ] Add model with pinHash field
  - [ ] Run migration
  - [ ] Create cardService.js
  - [ ] Create cardRoutes.js
  - [ ] Test all CRUD endpoints in Swagger
  - [ ] Verify cascade deletion

- [ ] **Transactions Table**
  - [ ] Add model with cardMode enum
  - [ ] Run migration
  - [ ] Create transactionService.js
  - [ ] Create transactionRoutes.js
  - [ ] Implement balance validation logic
  - [ ] Test debit mode (can't go negative)
  - [ ] Test credit mode (can go to -creditLimit)
  - [ ] Verify cascade deletion

### Week 4 Tasks:

- [ ] **JWT Authentication**
  - [ ] Install bcryptjs and jsonwebtoken
  - [ ] Create authService.js (hash PIN, verify PIN)
  - [ ] Create authRoutes.js (insert-card, verify-pin)
  - [ ] Create authMiddleware.js (JWT verification)
  - [ ] Protect all endpoints with auth middleware
  - [ ] Update Qt frontend for two-step auth flow

---

## Testing Cascade Deletion

```bash
# In Swagger UI:

1. POST /api/customers → Create customer (ID: 5)
2. POST /api/accounts → Create account (customerId: 5)
3. POST /api/cards → Create card (customerId: 5, accountId: from step 2)
4. POST /api/transactions → Create transaction (accountId: from step 2)
5. DELETE /api/customers/5 → Delete customer

✅ Expected: All accounts, cards, and transactions for customer 5 are deleted
❌ If you get foreign key errors: Check onDelete: Cascade is in schema
```

---

## Common Pitfalls

⚠️ **Forgot to run `npx prisma generate`** → Prisma Client not updated  
⚠️ **Missing `@map()` on fields** → Database columns wrong names  
⚠️ **Missing `@@map()` on model** → Table name not lowercase  
⚠️ **No `onDelete: Cascade`** → Can't delete parent records  
⚠️ **Used `Float` for money** → Use `Decimal @db.Decimal(15, 2)`  
⚠️ **Used `TIMESTAMP`** → Use `DateTime` instead  

---

**Reference:** See [DEVELOPMENT.md](DEVELOPMENT.md) for step-by-step implementation guide.
