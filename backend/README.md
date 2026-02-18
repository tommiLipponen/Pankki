# Bank ATM Backend API

**Production-ready REST API for Bank ATM System**  
**Node.js, Express, Prisma ORM + MySQL Stored Procedures**

## ✅ Production Ready (February 2026)

### 🎉 Complete Backend Implementation

✅ **Core Banking Features:**
- Customer management (CRUD operations)
- Account management with DEBIT/CREDIT modes
- Card management with bcrypt PIN hashing
- Transaction history with dual card mode tracking
- MySQL stored procedures for ACID withdrawals
- Complete Swagger/OpenAPI 3.0 documentation

✅ **Security & Authentication:**
- JWT authentication (60-day token expiry)
- Two-step auth flow (insert-card + verify-pin)
- bcrypt PIN hashing (10 rounds)
- PIN attempt tracking with auto-lock (3 failures)
- Card expiry and active status validation
- Protected endpoints with Bearer token middleware

✅ **Infrastructure:**
- Azure MySQL 8.0 (Sweden Central)
- Azure App Service deployment
- CI/CD pipeline with GitHub Actions
- Automated migrations on deployment
- Comprehensive test data seeding (~60 transactions)
- Rate limiting and CORS protection

✅ **Testing & Documentation:**
- Jest integration tests
- TEST_CREDENTIALS.md for QA
- STORED_PROCEDURES.md documentation
- OpenAPI 3.0 specification
- Development guides (DEVELOPMENT.md, SCHEMA.md)

## 📋 Development Timeline

### Week 3: Core Banking Features ✅ Complete
- ✅ **Accounts Table** - Bank accounts with creditLimit support
- ✅ **Cards Table** - ATM cards with pinHash field
- ✅ **Transactions Table** - Full transaction history with cardMode
- ✅ **Account Operations** - Deposit, withdrawal, transfer endpoints
- ✅ **Balance Management** - DEBIT (balance >= 0) and CREDIT (balance >= -creditLimit) modes
- ✅ **API Documentation** - Complete Swagger docs for all endpoints

### Week 4: Security & Authentication ✅ Complete
- ✅ **JWT Authentication** - Two-step auth (card + PIN)
  - ✅ Card insertion simulation (validate card number, expiry, active status)
  - ✅ PIN verification (4-digit code with bcrypt)
  - ✅ JWT token generation (60-day expiry, no refresh tokens)
  - ✅ Protected endpoints with Bearer authentication
- ✅ **Password Hashing** - Secure PIN storage with bcrypt (10 rounds)
- ✅ **Auth Middleware** - All banking operations protected
- ✅ **PIN Security** - Failed attempt tracking, auto-lock after 3 failures
- ✅ **Qt Auth Flow** - Frontend authentication fully integrated

### Week 5: Production Polish ✅ Complete
- ✅ **Error Handling** - Dynamic error messages with attempt counters
- ✅ **Input Validation** - Comprehensive validation on all endpoints
- ✅ **Stored Procedures** - MySQL stored procedure for atomic withdrawals
- ✅ **Integration Tests** - Full workflow testing with Jest
- ✅ **Documentation** - TEST_CREDENTIALS.md, STORED_PROCEDURES.md, API specs
- ✅ **Seed Data** - ~60 test transactions with realistic variety
- ✅ **Code Review** - Error handling audit, validation order fixes
- ✅ **Azure Deployment** - Production-ready with CI/CD pipeline
## 🔥 For Developers

**New to the project?** Essential documentation:
- 📚 [DEVELOPMENT.md](DEVELOPMENT.md) - Complete guide for adding features and database tables
- 📋 [SCHEMA.md](SCHEMA.md) - Database schema with ER diagrams
- 📦 [STORED_PROCEDURES.md](STORED_PROCEDURES.md) - MySQL stored procedure documentation
- 🎯 [TEST_CREDENTIALS.md](../TEST_CREDENTIALS.md) - Test card numbers and PINs for QA

**Key Files:**
- `src/controllers/authController.js` - Authentication endpoints
- `src/services/authService.js` - Auth business logic
- `src/middleware/authMiddleware.js` - JWT verification
- `prisma/schema.prisma` - Database schema (snake_case columns)
- `prisma/seed.js` - Test data generator (~60 transactions)

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/          # Request handlers (business logic)
│   │   ├── authController.js     # Authentication endpoints ✅
│   │   ├── customerController.js # Customer CRUD
│   │   ├── accountController.js  # Account operations
│   │   ├── cardController.js     # Card management
│   │   └── transactionController.js # Transactions + withdrawals
│   ├── routes/               # API endpoint definitions
│   │   ├── authRoutes.js         # /api/auth/* endpoints
│   │   ├── customerRoutes.js     # /api/customers/* endpoints
│   │   ├── accountRoutes.js      # /api/accounts/* endpoints
│   │   ├── cardRoutes.js         # /api/cards/* endpoints
│   │   └── transactionRoutes.js  # /api/transactions/* endpoints
│   ├── services/             # Database operations (Prisma + raw SQL)
│   │   ├── authService.js        # Auth logic with bcrypt ✅
│   │   ├── customerService.js    # Customer database operations
│   │   ├── accountService.js     # Account database operations
│   │   ├── cardService.js        # Card database operations
│   │   └── transactionService.js # Transactions + stored procedures ✅
│   ├── middleware/           # Express middleware
│   │   ├── authMiddleware.js     # JWT verification ✅
│   │   ├── cors.js               # CORS configuration
│   │   ├── rateLimiter.js        # Rate limiting (100 req/15min)
│   │   └── errorHandler.js       # Global error handler
│   ├── config/               # Configuration files
│   │   ├── database.js           # Prisma client singleton
│   │   └── swagger.js            # OpenAPI 3.0 specification
│   └── utils/                # Helper functions
├── prisma/
│   ├── schema.prisma         # Database schema (4 tables, snake_case)
│   ├── migrations/           # Migration history (31+ migrations)
│   └── seed.js               # Test data generator (~60 transactions)
├── tests/                    # Jest integration tests
│   ├── auth.test.js          # Authentication flow tests
│   └── customer.test.js      # Customer endpoint tests
├── .env.example              # Environment variable template
├── .env                      # Environment variables (not in Git)
├── server.js                 # Application entry point
├── package.json              # Dependencies and scripts
├── DEVELOPMENT.md            # Developer guide
├── SCHEMA.md                 # Database schema documentation
├── STORED_PROCEDURES.md      # Stored procedure documentation
└── README.md                 # This file
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MySQL database
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Setup database:**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   
   # Optional: Seed test data
   npm run prisma:seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 📝 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:migrate` - Create and apply database migrations
- `npm run swagger:generate` - Update API documentation
- `npm test` - Run tests with coverage
- `npm run lint` - Check code quality

### API Documentation

Access Swagger UI at: `http://localhost:3000/api-docs`

### Database Management

Access Prisma Studio at: `http://localhost:5555`
```bash
npm run prisma:studio
```

## 🗃️ Database Schema

**See [SCHEMA.md](SCHEMA.md) for complete database documentation with diagrams and relationships.**

### Main Tables (4 Total)
- `customers` - Customer information (firstName, lastName, address)
- `accounts` - Bank accounts with creditLimit for DEBIT/CREDIT modes
- `cards` - ATM cards with hashed PINs (bcrypt) and expiry dates
- `transactions` - Immutable transaction history with cardMode tracking

## 🔐 Authentication & Security

### JWT Authentication Flow

Two-step verification process:

1. **Card Insertion:** `POST /api/auth/insert-card`
   - Validates 16-digit card number
   - Checks card expiry date (must be future date)
   - Checks active status (isActive must be true)
   - Returns: `{availableCardMode, hasCredit, cardId}`

2. **PIN Verification:** `POST /api/auth/verify-pin`
   - Verifies 4-digit PIN with bcrypt
   - Tracks failed attempts (auto-locks after 3 failures)
   - Checks locked status, expiry, and active status
   - Returns: `{token, expiresIn: "60d", customer, account}`

3. **Protected Access:** All banking endpoints require:
   - `Authorization: Bearer {token}` header
   - Valid JWT (not expired, valid signature)
   - Middleware extracts: `{cardId, accountId, customerId, cardMode}`

**Auth Flow Example:**
```bash
# Step 1: Insert card
POST /api/auth/insert-card
{"cardNumber": "1234567890123456"}
→ {"cardId": 1, "availableCardMode": "DEBIT", "hasCredit": false}

# Step 2: Verify PIN
POST /api/auth/verify-pin
{"cardId": 1, "pin": "1234"}
→ {"token": "eyJhbGc...", "expiresIn": "60d", ...}

# Step 3: Use token for operations
POST /api/transactions/withdraw
Authorization: Bearer eyJhbGc...
{"amount": 50.00, "cardMode": "DEBIT"}
→ {"success": true, "data": {...}}
```

### Security Features

- ✅ **PIN Security:** bcrypt hashing (10 rounds, salt per-PIN)
- ✅ **Failed Attempts:** Auto-lock after 3 failed PIN attempts
- ✅ **Token Expiry:** 60-day JWT expiration
- ✅ **Environment Secrets:** JWT_SECRET, DATABASE_URL in .env
- ✅ **CORS Protection:** Configured for Qt frontend origin
- ✅ **Rate Limiting:** 100 requests per 15 minutes per IP
- ✅ **Input Validation:** All endpoints validate request data
- ✅ **SQL Injection Prevention:** Prisma parameterized queries + stored procedures

## 📚 API Endpoints

### Customers
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Accounts
- `GET /api/accounts` - List all accounts
- `GET /api/accounts/:id` - Get account by ID
- `POST /api/accounts` - Create new account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Cards
- `GET /api/cards` - List all cards
- `GET /api/cards/:id` - Get card by ID
- `POST /api/cards` - Create new card
- `PUT /api/cards/:id` - Update card
- `DELETE /api/cards/:id` - Delete card

### Transactions (🔒 Protected)
- `GET /api/transactions/account/:accountId` - Get account transactions (paginated)
- `GET /api/transactions/card/:cardId` - Get card transactions (paginated)
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions/withdraw` - **Withdraw using stored procedure** (ACID compliant)
- `POST /api/transactions/deposit` - Deposit funds
- `POST /api/transactions/transfer` - Transfer between accounts

### Authentication (Public Endpoints)
- `POST /api/auth/insert-card` - Step 1: Validate card number, expiry, active status
- `POST /api/auth/verify-pin` - Step 2: Verify PIN and receive JWT token

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Data

**Seed Database:**
```bash
npm run prisma:seed
```

Creates:
- 5 customers (Finnish names)
- 8 accounts (mix of DEBIT-only and CREDIT accounts)
- 12 cards (6 working, 4 error test cards)
- ~60 transactions (realistic variety)

**Test Credentials:** See [TEST_CREDENTIALS.md](../TEST_CREDENTIALS.md)

**Example Working Cards:**
- Card: `1234567890123456`, PIN: `1234` (Matti, DEBIT only, €1,500)
- Card: `1234567890123457`, PIN: `1234` (Matti, DEBIT+CREDIT, €500 + €1,000 credit)
- Card: `4567890123456789`, PIN: `5678` (Anna, DEBIT+CREDIT, €2,100 + €2,000 credit)

**Error Test Cards:**
- Card: `2345678901234568` (Locked - 3 failed attempts)
- Card: `3456789012345679` (Expired - expiry date in past)
- Card: `4567890123456790` (Inactive - isActive = false)

## 🚢 Deployment

### Production Environment

- **Backend URL:** https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net
- **API Docs:** https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net/api-docs
- **Database:** Azure MySQL 8.0 (Sweden Central)
- **Platform:** Azure App Service (Node.js 22)
- **CI/CD:** GitHub Actions (automatic deployment on push to main)

### Azure Configuration

**Environment Variables (Azure Portal):**
```env
DATABASE_URL=mysql://user@server.mysql.database.azure.com:3306/pankki_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=60d
NODE_ENV=production
PORT=8080
```

**Deployment Process:**
1. Push to `main` branch
2. GitHub Actions triggers
3. Run tests
4. Deploy migrations: `npx prisma migrate deploy`
5. Deploy to Azure App Service
6. Health check: `/health` endpoint

**Manual Seeding (Development Only):**
```bash
# Update .env to Azure DATABASE_URL
npm run prisma:seed
```

⚠️ **Note:** Auto-seeding removed from CI/CD to preserve production data

## 👥 Team

**Group 1 - Full Stack Development Team:**
- Tommi Lipponen - Backend Developer, Database & Deployment Specialist
- Iisa Metsola - Full Stack Developer, UX & Documentation
- Topi Pietilänaho - Frontend Developer, Qt Logic & API Integration
- Tommy Näsänen - Backend Developer, Middleware & Testing

**Course:** Application Project Spring 2026  
**Organization:** Oulu University of Applied Sciences (OAMK)

## 🔗 Links

- **Production API:** https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net
- **API Docs:** https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net/api-docs
- **Repository:** https://github.com/25kmo-project/group_1
- **Qt Frontend:** [`/frontend`](../frontend)
- **Test Credentials:** [TEST_CREDENTIALS.md](../TEST_CREDENTIALS.md)

## 📄 License

MIT License - Educational Project (OAMK 2026)
