# 🏦 Bank ATM System - Pankki Project

**OAMK Software Development Application Project (Spring 2026)**

A simulated ATM (Automated Teller Machine) banking system with a Qt desktop application frontend and Node.js REST API backend.

---

## 👥 Team Members

| Name | Role | Responsibilities |
|------|------|-----------------|
| Iisa Metsola | Full Stack Developer | UX, Documentation, Full Stack |
| Topi Pietilänaho | Full Stack Developer | Qt Logic, API Integration |
| Tommi Lipponen | Full Stack Developer | Prisma, Deployment |
| Tommy Näsänen | Full Stack Developer | Database Design, Middleware, Testing |

*Note: In this course project, all team members contribute to both frontend and backend development to gain full-stack experience.*

---

## 🎯 Project Goals

**Target Grade:** [1-5]

**Current Status:** ✅ **Production Ready (February 2026)**

**Completed Milestones:**

✅ **Week 2 Complete:**
- Customer CRUD operations
- Swagger API documentation
- CI/CD pipeline with GitHub Actions
- Azure MySQL + Prisma ORM
- Qt C++ frontend connected to API

✅ **Week 3 Complete:**
- Accounts, Cards, Transactions tables
- Basic banking operations
  
✅ **Week 4 Complete:**
- JWT authentication with card + PIN verification
- PIN attempt tracking (auto-lock after 3 failures)
- Customer-based authorization

✅ **Week 5 Complete:**
- Enhanced transaction operations
- Full ATM UI implementation
- Production deployment

---

## ✅ **Implemented Features:**
- ✅ PIN validation with security tracking
- ✅ Card locking after 3 failed attempts
- ✅ Balance inquiry
- ✅ Cash withdrawal operations (via stored procedure)
- ✅ Transaction history with pagination
- ✅ Debit card support
- ✅ Credit card support with credit limits
- ✅ Dual cards (customer-based authorization)

---

## � Documentation & APIs

### 🌐 Live Production
- **Swagger UI**: https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net/api-docs
- **Production API**: https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net
- **OpenAPI JSON**: https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net/api-docs.json

### 📖 Technical Documentation
- **Frontend Architecture**: [Component Diagrams](frontend/docs/component-diagram.md)
- **Component Descriptions**: [UML & Details](frontend/docs/component-descriptions.md)
- **UI State Diagram**: [6-Page ATM Flow](frontend/docs/ui-description.md)
- **OpenAPI Specification**: [REST API Docs](frontend/docs/api-specification.md)

### 🗄️ Database & Backend
- **Database Schema**: [SCHEMA.md](backend/SCHEMA.md) - ER diagrams and table relationships
- **Stored Procedures**: [STORED_PROCEDURES.md](backend/STORED_PROCEDURES.md) - MySQL procedures
- **Test Credentials**: [TEST_CREDENTIALS.md](TEST_CREDENTIALS.md) - 10+ test cards with PINs

### 📝 README Files
- **Backend README**: [backend/README.md](backend/README.md) - Production API documentation
- **Frontend README**: [frontend/README.md](frontend/README.md) - Qt C++ application guide

---

## �🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 22 LTS
- **Framework:** Express.js
- **ORM:** Prisma 5.22.0
- **Database:** Azure MySQL 8.0 (Sweden Central)
- **Authentication:** JWT (bcrypt PIN hashing, 60-day expiry, production-ready)
- **Testing:** Node:test + supertest
- **Documentation:** Swagger/OpenAPI
- **CI/CD:** GitHub Actions
- **Deployment:** Azure App Service

### Frontend
- **Framework:** Qt 6.8.1 Widgets (C++17)
- **Build System:** CMake 3.16+
- **Compiler:** MSVC 2022 (64-bit)
- **HTTP Client:** Qt Network module with OpenSSL 3.x
- **IDE:** Visual Studio 2026 Professional / Qt Creator

### Development Tools
- **Version Control:** Git + GitHub
- **Backend IDE:** VS Code
- **Frontend IDE:** Visual Studio 2026 / Qt Creator
- **Collaboration:** MS Teams

---

## 📁 Project Structure

```
Pankki/
├── backend/              # Node.js/Express REST API
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # CORS, error handling
│   │   ├── services/     # Prisma database operations
│   │   ├── utils/        # Helpers
│   │   └── config/       # Configuration
│   ├── prisma/           # Database schema & migrations
│   ├── swagger/          # API documentation
│   ├── tests/            # Unit & integration tests
│   └── server.js         # Application entry point
│
├── frontend/             # Qt C++ desktop application ✅ ACTIVE
│   ├── main.cpp          # Application entry
│   ├── mainwindow.*      # Main window (test UI)
│   ├── apiclient.*       # REST API HTTP client
│   ├── customer.*        # Customer data model
│   ├── CMakeLists.txt    # Build configuration
│   └── README.md         # Frontend documentation
│
├── documents/            # Course documentation
│   ├── projektidokumentti.docx
│   ├── tekninen-maarittely.docx
│   ├── er-diagram.png
│   └── poster.pdf
│
├── .github/workflows/    # CI/CD pipelines
├── .gitignore
└── README.md             # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v22+ (LTS)
- MySQL 8.0+ (or Azure MySQL)
- Qt 6.x with CMake
- Visual Studio 2026 Professional (with Qt extension)
- VS Code

### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Setup database
npm run prisma:generate
npm run prisma:migrate

# Start development server
npm run dev
```

Backend will run at: `http://localhost:3000`
API Documentation: `http://localhost:3000/api-docs`
OpenAPI Spec (for Qt): `http://localhost:3000/api-docs.json`

### Frontend Setup

**Prerequisites:**
- Qt 6.8.5 with MSVC 2022
- Visual Studio 2026 Professional (with Qt Tools extension)
- OpenSSL 3.x for HTTPS support

**Quick Start:**

1. Open Visual Studio 2026
2. File → Open → Folder
3. Select `frontend` folder
4. Select configuration: **vs-debug** or **vs-release**
5. Build and run (F5)

**Detailed instructions:** See [Frontend README](./frontend/README.md)

**Testing API Connection:**
- Run the app and click "Health Check" button
- Then click "Get All Customers" to verify Azure connection

---

## 🗃️ Database Schema

**Full Documentation:** [backend/SCHEMA.md](backend/SCHEMA.md)

**Main Entities:**
- **Customers** (asiakkaat) - Customer information
- **Accounts** (tilit) - Debit/Credit accounts with balances
- **Cards** (kortit) - Card details, PIN hashes, lock status
- **Transactions** (tapahtumat) - Transaction history with balance tracking
- **Card-Account Links** - Dual card support (one card, multiple accounts)

**Key Features:**
- PINs stored as bcrypt hashes (10 rounds)
- Failed PIN attempt tracking (auto-lock after 3 failures)
- Credit limit support for credit cards
- Transaction balance validation
- MySQL stored procedures for atomic operations (e.g., `usp_withdraw_money`)

**Database Type:** Azure MySQL 8.0 (Sweden Central)  
**ORM:** Prisma 5.x with snake_case naming convention

---

## 📡 API Endpoints

**Full API Documentation:** [Swagger UI](https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net/api-docs)

### ✅ Implemented Endpoints

#### Core Operations
- **Customers:** Full CRUD operations
- **Accounts:** Full CRUD + balance management
- **Cards:** Full CRUD with authentication
- **Transactions:** Create, view history with pagination
- **Health Check:** `/health`
- **API Docs:** `/api-docs` (Swagger UI)

#### Authentication (Week 4)
- ✅ `POST /api/auth/insert-card` - Step 1: Validate card number
- ✅ `POST /api/auth/verify-pin` - Step 2: Verify PIN, get JWT token
- All authenticated endpoints require: `Authorization: Bearer {token}`

#### Transaction Operations (Week 5)
- ✅ Withdrawal operations (secured with JWT)
- ✅ Balance inquiry (DEBIT/CREDIT modes)
- ✅ Transaction history with filtering

---

## 🔐 Authentication Flow

### Overview
The system uses a two-step authentication process with JWT (JSON Web Tokens) for secure ATM operations.

### Step-by-Step Process

#### **Step 1: Insert Card** (`POST /api/auth/insert-card`)

**Path:** `backend/src/routes/authRoutes.js` → `backend/src/controllers/authController.js` → `backend/src/services/authService.js`

**User Action:** User inserts card (enters 16-digit card number)

**Request:**
```http
POST /api/auth/insert-card
Content-Type: application/json

{
  "cardNumber": "1234567890123456"
}
```

**Backend Process:**
1. **Route Handler** (`authRoutes.js`):
   - Receives POST request at `/api/auth/insert-card`
   - Calls `authController.insertCard()`

2. **Controller** (`authController.js`):
   - Validates card number format (16 digits)
   - Calls `authService.validateCard(cardNumber)`

3. **Service** (`authService.js`):
   - Queries database: `prisma.card.findFirst()` with `cardNumber`
   - Includes related data: `account` and `customer`
   - Performs validation checks:
     - ❌ Card doesn't exist → Error: "Card not found"
     - ❌ `isActive = false` → Error: "Card is not active"
     - ❌ `isLocked = true` → Error: "Card is locked"
     - ❌ `expiryDate < now` → Error: "Card has expired"
   - Determines available card modes:
     - DEBIT: Always available
     - CREDIT: Only if `account.creditLimit > 0`

**Response (Success):**
```json
{
  "success": true,
  "message": "Card validated successfully",
  "cardMode": ["DEBIT", "CREDIT"]
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Card is locked due to multiple failed PIN attempts"
}
```

**No JWT token yet** - just validates that the card exists and is usable.

---

#### **Step 2: Verify PIN** (`POST /api/auth/verify-pin`)

**Path:** `backend/src/routes/authRoutes.js` → `backend/src/controllers/authController.js` → `backend/src/services/authService.js`

**User Action:** User enters 4-digit PIN and selects card mode (DEBIT or CREDIT)

**Request:**
```http
POST /api/auth/verify-pin
Content-Type: application/json

{
  "cardNumber": "1234567890123456",
  "pin": "1234",
  "cardMode": "DEBIT"
}
```

**Backend Process:**

1. **Route Handler** (`authRoutes.js`):
   - Receives POST request at `/api/auth/verify-pin`
   - Calls `authController.verifyPin()`

2. **Controller** (`authController.js`):
   - Validates PIN format (4 digits)
   - Calls `authService.verifyPinAndGenerateToken(cardNumber, pin, cardMode)`

3. **Service - PIN Verification** (`authService.js`):
   
   a. **Fetch Card Data:**
   ```javascript
   const card = await prisma.card.findFirst({
     where: { cardNumber },
     include: {
       account: true,   // Related account
       customer: true   // Card owner
     }
   });
   ```

   b. **Security Checks:**
   - ❌ Card not found → Error
   - ❌ `card.isLocked = true` → Error: "Card is locked due to multiple failed PIN attempts"

   c. **PIN Verification:**
   ```javascript
   const isPinValid = await bcrypt.compare(pin, card.pinHash);
   ```
   
   **If PIN is WRONG:**
   ```javascript
   // Increment failed attempt counter
   const newFailedAttempts = card.failedPinAttempts + 1;
   const shouldLock = newFailedAttempts >= 3;

   await prisma.card.update({
     where: { id: card.id },
     data: {
       failedPinAttempts: newFailedAttempts,
       lastFailedAttempt: new Date(),
       isLocked: shouldLock  // Lock after 3 attempts
     }
   });

   // Return error with remaining attempts
   throw new Error(`Invalid PIN. ${3 - newFailedAttempts} attempts remaining.`);
   ```

   **If PIN is CORRECT:**
   ```javascript
   // Reset failed attempts counter
   if (card.failedPinAttempts > 0) {
     await prisma.card.update({
       where: { id: card.id },
       data: {
         failedPinAttempts: 0,
         lastFailedAttempt: null
       }
     });
   }
   ```

   d. **Validate Card Mode:**
   ```javascript
   if (cardMode === "CREDIT" && (!card.account.creditLimit || card.account.creditLimit <= 0)) {
     throw new Error("CREDIT mode is not available for this card");
   }
   ```

   e. **Generate JWT Token:**
   ```javascript
   const tokenPayload = {
     cardId: card.id,           // Which card is being used
     accountId: card.account.id,  // Which account card is linked to
     customerId: card.customer.id, // Who owns the card
     cardMode: cardMode          // Transaction mode (DEBIT/CREDIT)
   };

   const token = jwt.sign(
     tokenPayload,
     process.env.JWT_SECRET,      // Secret key from .env
     { expiresIn: '60d' }         // Token expires in 60 days
   );
   ```

**Response (Success):**
```json
{
  "success": true,
  "message": "PIN verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXJkSWQiOjEsImFjY291bnRJZCI6MSwiY3VzdG9tZXJJZCI6MSwiY2FyZE1vZGUiOiJERUJJVCIsImlhdCI6MTczODA4MDAwMCwiZXhwIjoxNzQzMjY0MDAwfQ.signature",
  "expiresIn": "60d",
  "customer": {
    "id": 1,
    "firstName": "Matti",
    "lastName": "Virtanen"
  },
  "account": {
    "id": 1,
    "accountNumber": "FI1234567890123456",
    "balance": 1500.00,
    "creditLimit": 0.00
  },
  "cardMode": "DEBIT"
}
```

**Response (Wrong PIN - 1st/2nd attempt):**
```json
{
  "success": false,
  "message": "Invalid PIN. 2 attempts remaining."
}
```

**Response (Wrong PIN - 3rd attempt):**
```json
{
  "success": false,
  "message": "Card is now locked due to 3 failed PIN attempts. Please contact customer service."
}
```

---

#### **Step 3: Using the JWT Token**

**Path:** `backend/src/middleware/authMiddleware.js` → Controller

**User Action:** Makes any authenticated request (e.g., check balance, withdraw)

**Request:**
```http
GET /api/accounts/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Backend Process:**

1. **Authentication Middleware** (`authMiddleware.js`):
   
   a. **Extract Token:**
   ```javascript
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1]; // Get "Bearer <token>"
   ```

   b. **Verify Token:**
   ```javascript
   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
     if (err) {
       return res.status(403).json({
         success: false,
         message: 'Invalid or expired token'
       });
     }
     
     // Attach decoded payload to request
     req.user = decoded; // { cardId, accountId, customerId, cardMode }
     next(); // Continue to controller
   });
   ```

2. **Authorization Check in Controller:**
   ```javascript
   // Example: accountController.getAccountById()
   
   // Fetch the requested account
   const account = await accountService.getAccountById(req.params.id);
   
   // Check if account belongs to the authenticated customer
   if (parseInt(req.user.customerId) !== parseInt(account.customerId)) {
     return res.status(403).json({
       success: false,
       message: "Access denied: You can only access your own accounts"
     });
   }
   
   // Customer owns this account - allow access
   return res.json({ success: true, data: account });
   ```

**JWT Payload Structure:**
```javascript
req.user = {
  cardId: 1,        // The card being used for this session
  accountId: 1,     // The account linked to this card
  customerId: 1,    // The customer who owns the card
  cardMode: "DEBIT", // Transaction mode
  iat: 1738080000,  // Issued at timestamp
  exp: 1743264000   // Expiration timestamp
}
```

---

### Security Features

#### 🔒 **PIN Attempt Tracking**
- **Database Fields:**
  - `failedPinAttempts` (INT, default: 0) - Counts consecutive failures
  - `lastFailedAttempt` (DATETIME, nullable) - Timestamp of last failure
  - `isLocked` (BOOLEAN, default: false) - Lock status

- **Logic:**
  1. Wrong PIN → increment `failedPinAttempts`
  2. `failedPinAttempts >= 3` → set `isLocked = true`
  3. Correct PIN → reset `failedPinAttempts = 0`
  4. Locked card → reject all PIN attempts until unlocked by admin

#### 🛡️ **Customer-Based Authorization**
- Users can access **all accounts and cards** they own
- Not limited to just the account their current card is linked to
- Example: Customer has 2 accounts and 2 cards:
  - Card A linked to Account 1
  - Card B linked to Account 2
  - Authenticating with Card A allows access to **both** Account 1 and Account 2

#### ⏱️ **Token Expiration**
- Tokens expire after 60 days
- Frontend must handle 401/403 responses and re-authenticate

#### 🔑 **bcrypt PIN Hashing**
- PINs stored as bcrypt hashes with 10 rounds
- Verification uses `bcrypt.compare()` - timing-safe comparison
- Raw PINs never stored in database

---

### Testing Credentials

**For complete test card numbers and PINs, see:** [TEST_CREDENTIALS.md](TEST_CREDENTIALS.md)

The seed file includes 10+ test cards with various configurations:
- Active cards (DEBIT and CREDIT)
- Locked cards (for testing security features)
- Multiple customers with different account types
- Cards with varying credit limits

**Quick Test Cards:**
- Matti Virtanen: `1234567890123456` (PIN: `1234`)
- Anna Mäkinen: `4567890123456789` (PIN: `5678`)
- Locked card example: `2345678901234568` (for testing lock feature)

---

### Error Handling

| Status Code | Error | Cause |
|------------|-------|-------|
| 400 | Bad Request | Invalid card/PIN format |
| 401 | Unauthorized | Missing token |
| 403 | Forbidden | Invalid/expired token, or accessing another customer's resources |
| 404 | Not Found | Card doesn't exist |
| 500 | Internal Server Error | Database/server error |

---

### File Locations

**Authentication Routes:**
- `backend/src/routes/authRoutes.js` - Defines `/api/auth/insert-card` and `/api/auth/verify-pin`

**Controllers:**
- `backend/src/controllers/authController.js` - Handles request validation and calls services

**Services:**
- `backend/src/services/authService.js` - Business logic for card validation, PIN verification, JWT generation

**Middleware:**
- `backend/src/middleware/authMiddleware.js` - Verifies JWT tokens and attaches `req.user`

**Database Schema:**
- `backend/prisma/schema.prisma` - Card model with `failedPinAttempts`, `lastFailedAttempt`, `isLocked`

**Seed Data:**
- `backend/prisma/seed.js` - Test cards with bcrypt-hashed PINs

**Environment:**
- `backend/.env` - Contains `JWT_SECRET` and `JWT_EXPIRES_IN`

---

## 🧪 Testing

```bash
# Run all tests
cd backend
npm test

# Run tests in watch mode
npm run test:watch
```

**Testing Stack:**
- Node:test (native test runner)
- supertest (HTTP assertions)
- Tests run automatically in CI/CD pipeline

---

## 🚢 Deployment

### Backend (Azure App Service)
**Live API:** https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net

**CI/CD Pipeline (GitHub Actions):**
1. Runs on every push to `main` branch
2. Installs dependencies
3. Generates Prisma Client
4. Deploys database migrations
5. Runs automated tests
6. Deploys to Azure App Service

**Manual Deployment:**
Triggered automatically via GitHub Actions. No manual steps required.

### Frontend
Compiled executables available in GitHub Releases

---

## 📚 Documentation

**📖 See detailed documentation links in the [Documentation & APIs](#-documentation--apis) section above.**

### Project Documents
- [Technical Specification](./documents/tekninen-maarittely.docx) - Finnish technical specification
- [Project Plan](./documents/projektidokumentti.docx) - Project documentation
- [ER Diagram](./documents/er-diagram.png) - Database entity-relationship diagram

---

## 📅 Project Timeline

| Week | Milestone | Status |
|------|-----------|--------|
| 1 | Project setup, ER diagram approved | ✅ Complete |
| 2 | CRUD operations demo, project document complete | ✅ Complete |
| 3 | Accounts/Cards/Transactions tables & APIs | ✅ Complete |
| 4 | JWT authentication (card + PIN), auto-lock security | ✅ Complete |
| 5 | Full transaction system & error handling | ✅ Complete |
| 6 | UI polish & comprehensive testing | 📋 Planned |
| 7 | Technical documentation & poster | 📋 Planned |
| 8 | Final presentation & demo | 📋 Planned |

---

## 🎓 Course Information

- **Course:** Ohjelmistokehityksen sovellusprojekti
- **Institution:** OAMK (Oulu University of Applied Sciences)
- **Semester:** Spring 2026
- **Instructors:** Teemu Korpela, Pekka Alaluukas

---

## 📄 License

MIT License - Educational Project

---

## 🔗 Links

- [MS Teams Channel](#) - Team collaboration
- [GitHub Repository](#) - Version control
- [Azure Portal](#) - Deployment management
- [Course Materials](https://peatutor.com/)

---

## 📝 Notes

### Weekly Progress
<!-- Update weekly -->

**Week 1:**
- [x] Repository initialized
- [x] Project structure created
- [x] Azure MySQL database provisioned
- [x] Prisma ORM integrated
- [x] Customer CRUD API implemented
- [x] Swagger/OpenAPI documentation added
- [x] Azure App Service deployment configured
- [x] GitHub Actions CI/CD pipeline setup
- [x] Rate limiting implemented
- [x] Node.js upgraded to v22 LTS
- [x] Automated testing framework (Node:test + supertest)
- [x] Automated database migrations in CI/CD
- [x] OpenAPI JSON endpoint for Qt client generation

**Week 2:**
- [x] Qt 6.8.5 frontend project setup
- [x] Visual Studio 2026 compatibility configured
- [x] CMake build system with automatic DLL deployment
- [x] OpenSSL integration for HTTPS/TLS
- [x] REST API client (`ApiClient` class) implemented
- [x] Customer data model with JSON serialization
- [x] Successfully connected frontend to Azure backend
- [x] API connection test UI created
- [x] UTF-8 support for Scandinavian characters verified
- [x] Repository migrated to professor's organization
- [x] Team expanded to 4 members
- [x] Local MySQL development environment setup

**Week 3:**
- [x] Accounts table and API endpoints
- [x] Cards table (without authentication)
- [x] Transactions table
- [x] Basic transaction operations
- [ ] Qt models for Account, Card, Transaction
- [ ] Basic ATM UI design

**Week 4 (Current):**
- [x] JWT authentication implementation ✅
- [x] Card + PIN verification flow ✅
- [x] PIN attempt tracking (lock after 3 failures) ✅
- [x] Protected API endpoints ✅
- [x] Customer-based authorization ✅
- [ ] Qt authentication screens

---

## ✅ Production Features Summary

All backend features have been successfully implemented and are production-ready:

### 🔐 Authentication System (Week 4)
- **Auth Routes:**
  - ✅ `POST /api/auth/insert-card` - Validate card number exists
  - ✅ `POST /api/auth/verify-pin` - Verify PIN hash, return JWT token
- **JWT Middleware:**
  - ✅ Token generation with expiry (60 days)
  - ✅ Token verification middleware for protected routes
  - ✅ JWT secret in environment variables
- **Security:**
  - ✅ bcrypt PIN hashing in seed.js (10 rounds)
  - ✅ PIN verification using bcrypt.compare()
  - ✅ Auto-lock after 3 failed PIN attempts
  - ✅ Failed attempt tracking (failedPinAttempts, lastFailedAttempt)

### 🔒 Protected Routes
- ✅ JWT authentication middleware on all routes
- ✅ Customer-based authorization (users can access all their accounts/cards)
- ✅ Middleware checks: `Authorization: Bearer {token}`

### 🛡️ Card Security Features
- ✅ Track failed PIN attempts in database
- ✅ Lock card after 3 consecutive failures
- ✅ Update `is_locked` and `last_failed_attempt` timestamp
- ✅ Reset counter on successful login

### 💳 Transaction Operations (Week 5)
- ✅ Withdrawal operations via MySQL stored procedure (`usp_withdraw_money`)
- ✅ Balance inquiry with DEBIT/CREDIT mode support
- ✅ Transaction history with pagination
- ✅ Sufficient balance validation (balance + credit limit)
- ✅ Atomic database operations
- ✅ Transaction recording with `balance_after` tracking

### ✔️ Validation & Error Handling
- ✅ Input validation with express-validator
- ✅ Sanitization for SQL injection prevention
- ✅ Custom validators for account numbers, card numbers
- ✅ Centralized error handler middleware
- ✅ Consistent JSON error responses

### 🧪 Testing & Quality
- ✅ Automated test suite (Node:test + supertest)
- ✅ Transaction endpoint tests
- ✅ Card locking mechanism tests
- ✅ CI/CD pipeline with automated testing
- ✅ Multiple test customers with realistic seed data

---

### Team Meetings
<!-- Add meeting notes -->

---

**Last Updated:** February 18, 2026
