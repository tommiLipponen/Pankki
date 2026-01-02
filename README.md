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
| TBD | Full Stack Developer | TBD |

---

## 🎯 Project Goals

**Target Grade:** [1-5]

**Features Implemented:**
- [ ] Debit card support
- [ ] Credit card support (grade 3+)
- [ ] Dual cards (grade 5)
- [ ] PIN validation with timeout
- [ ] Card locking after 3 failed attempts
- [ ] Balance inquiry
- [ ] Cash withdrawal (fixed amounts)
- [ ] Custom withdrawal amounts (grade 3+)
- [ ] Transaction history
- [ ] Transaction browsing (grade 4+)
- [ ] All CRUD operations (grade 2+)
- [ ] Swagger documentation (bonus +1)
- [ ] CI/CD pipeline (bonus +1)

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 22 LTS
- **Framework:** Express.js 5.2
- **ORM:** Prisma 5.22.0
- **Database:** Azure MySQL Flexible Server
- **Testing:** Node:test (native) + supertest
- **Documentation:** Swagger UI / OpenAPI 3.0
- **Deployment:** Azure App Service (Basic B1)
- **CI/CD:** GitHub Actions (with automated testing & migrations)

### Frontend
- **Framework:** Qt 6 (C++)
- **Build System:** CMake
- **HTTP Client:** Qt Network module
- **IDE:** Visual Studio 2026 Professional

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

### Authentication
- `POST /api/auth/validate-pin` - Validate card and PIN

### Accounts
- `GET /api/accounts/:id` - Get account details
- `GET /api/accounts/:id/balance` - Check balance
- `GET /api/accounts/:id/transactions` - Transaction history

### Transactions
- `POST /api/transactions/withdraw` - Withdraw money

### CRUD Operations
Full CRUD for: Customers, Accounts, Cards, Transactions

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

| Week | Milestone |
|------|-----------|
| 1 | Project setup, ER diagram approved |
| 2 | CRUD operations demo, project document complete |
| 3 | Technical specification complete |
| 4 | Authentication & basic transactions |
| 5 | Full transaction system |
| 6 | UI polish & testing |
| 7 | Poster & demo video |
| 8 | Final presentation |

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
- [ ] ATM user interface design (in progress)
- [ ] Account & Card data models (planned)

### Team Meetings
<!-- Add meeting notes -->

---

**Last Updated:** December 22, 2025
