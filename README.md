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

**Current Progress:**

✅ **Week 2 Complete:**
- Customer CRUD operations
- Swagger API documentation
- CI/CD pipeline with GitHub Actions
- Azure MySQL + Prisma ORM
- Qt C++ frontend connected to API

🔄 **Week 3 In Progress:**
- Accounts, Cards, Transactions tables
- Basic banking operations

📋 **Upcoming Features:**
- [ ] JWT authentication (Week 4) - Card + PIN verification
- [ ] PIN validation with timeout
- [ ] Card locking after 3 failed attempts
- [ ] Balance inquiry
- [ ] Cash withdrawal operations
- [ ] Transaction history
- [ ] Debit card support
- [ ] Credit card support (grade 3+)
- [ ] Dual cards (grade 5)

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 22 LTS
- **Framework:** Express.js
- **ORM:** Prisma 5.22.0
- **Database:** Azure MySQL
- **Authentication:** JWT (Week 4)
- **Testing:** Jest
- **Documentation:** Swagger/OpenAPI
- **CI/CD:** GitHub Actions
- **Deployment:** Azure App Service

### Frontend
- **Framework:** Qt 6 (C++)
- **Build System:** CMake
- **HTTP Client:** Qt Network module
- **IDE:** Visual Studio 2026 Pro / Qt Creator

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

<!-- TODO: Add ER diagram image here -->

**Main Entities:**
- Customers (asiakkaat)
- Accounts (tilit) - Debit/Credit
- Cards (kortit) - PIN, lock status
- Transactions (tapahtumat)
- Card-Account Links (dual card support)

**Security:**
- PINs stored as bcrypt hashes
- 10 rounds of hashing

---

## 📡 API Endpoints

### Current (Week 2)
- **Customers:** Full CRUD operations
- **Health Check:** `/health`
- **API Docs:** `/api-docs`

### Planned Week 3
- **Accounts:** Full CRUD + balance management
- **Cards:** Full CRUD (without auth)
- **Transactions:** Create and view history

### Planned Week 4 - Authentication
- `POST /api/auth/insert-card` - Step 1: Validate card number
- `POST /api/auth/verify-pin` - Step 2: Verify PIN, get JWT token
- All endpoints protected with: `Authorization: Bearer {token}`

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

- [Backend API Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md) ✅ **Updated**
- [Database Schema](./documents/er-diagram.png)
- [Technical Specification](./documents/tekninen-maarittely.docx)
- [Project Plan](./documents/projektidokumentti.docx)

---

## 📅 Project Timeline

| Week | Milestone | Status |
|------|-----------|--------|
| 1 | Project setup, ER diagram approved | ✅ Complete |
| 2 | CRUD operations demo, project document complete | ✅ Complete |
| 3 | Accounts/Cards/Transactions tables & APIs | 🔄 In Progress |
| 4 | JWT authentication (card + PIN) | 📋 Planned |
| 5 | Full transaction system & error handling | 📋 Planned |
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

**Week 3 (Current):**
- [x] Accounts table and API endpoints
- [x] Cards table (without authentication)
- [x] Transactions table
- [ ] Qt models for Account, Card, Transaction
- [ ] Basic ATM UI design

**Week 4 (Planned):**
- [ ] JWT authentication implementation
- [ ] Card + PIN verification flow
- [ ] Protected API endpoints
- [ ] Qt authentication screens

---

## 🔨 Remaining Backend Work

### 🔴 Critical Priority (Week 4)

#### 1. Authentication System
- **Auth Routes:**
  - `POST /api/auth/insert-card` - Validate card number exists
  - `POST /api/auth/verify-pin` - Verify PIN hash, return JWT token
- **JWT Middleware:**
  - Token generation with expiry (e.g., 30 minutes)
  - Token verification middleware for protected routes
  - Optional: Refresh token logic
- **Security:**
  - bcrypt PIN hashing in seed.js (10 rounds)
  - PIN verification using bcrypt.compare()
  - JWT secret in environment variables

#### 2. Protected Routes
- Add JWT authentication middleware to all routes
- Verify user owns the resource they're accessing
- Middleware checks: `Authorization: Bearer {token}`

### 🟡 Important Priority (Business Logic)

#### 3. Transaction Business Logic
- **POST Routes:**
  - `POST /api/transactions/withdraw` - Check balance + credit limit
  - `POST /api/transactions/deposit` - Add funds
  - `POST /api/transactions/transfer` - Between accounts
- **Validation:**
  - Sufficient balance check (balance + credit_limit)
  - Credit limit enforcement
  - Update account balance after transaction
- **Recording:**
  - Create transaction record with `balance_after`
  - Atomic operations (use Prisma transactions)

#### 4. Card Security Features
- **PIN Attempt Tracking:**
  - Track failed PIN attempts (consider separate table or cache)
  - Lock card after 3 consecutive failures
  - Update `is_locked` timestamp
- **Endpoints:**
  - `POST /api/cards/:id/lock` - Manual lock
  - `POST /api/cards/:id/unlock` - Admin unlock
  - `GET /api/cards/:id/attempts` - Check attempt count

### 🟢 Nice to Have

#### 5. Validation & Error Handling
- **Input Validation:**
  - Use express-validator or Joi
  - Sanitization for SQL injection prevention
  - Custom validators for account numbers, card numbers
- **Error Handler Middleware:**
  - Centralized error handler
  - Consistent JSON error responses
  - Error logging

#### 6. Seed File Implementation
- Create `backend/prisma/seed.js` with:
  - Multiple test customers
  - Accounts (debit + credit types)
  - Cards with bcrypt-hashed PINs (e.g., "1234")
  - Sample transactions with correct balances
- Document test credentials in README

#### 7. Testing
- Unit tests for business logic functions
- Integration tests for auth flow
- Transaction endpoint tests
- Card locking mechanism tests

---

### Team Meetings
<!-- Add meeting notes -->

---

**Last Updated:** January 22, 2026
