# 🏦 Bank ATM System - Pankki Project

**OAMK Software Development Application Project (Spring 2026)**

A simulated ATM (Automated Teller Machine) banking system with a Qt desktop application frontend and Node.js REST API backend.

---

## 👥 Team Members

| Name | Role | Responsibilities |
|------|------|-----------------|
| Member 1 | Backend Developer | API, Database, Prisma |
| Member 2 | Backend Developer | API, Testing, Deployment |
| Member 3 | Frontend Developer | Qt UI, User Experience |
| Member 4 | Frontend Developer | Qt Logic, API Integration |

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
- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** Azure MySQL
- **Documentation:** Swagger UI / OpenAPI
- **Deployment:** Azure App Service
- **CI/CD:** GitHub Actions

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
├── bank-automat/         # Qt C++ desktop application
│   ├── src/              # Source files
│   ├── ui/               # UI forms (.ui files)
│   ├── CMakeLists.txt    # Build configuration
│   └── README.md
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
- Node.js v18+
- MySQL 8.0+
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

### Frontend Setup

1. Open Visual Studio 2026
2. File → Open → Folder
3. Select `bank-automat` folder
4. Configure Qt kit if prompted
5. Build and run (F5)

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

# Run with coverage
npm run test:watch
```

---

## 🚢 Deployment

### Backend (Azure App Service)
<!-- TODO: Add deployment instructions -->

### Frontend
Compiled executables available in GitHub Releases

---

## 📚 Documentation

- [Backend API Documentation](./backend/README.md)
- [Frontend Documentation](./bank-automat/README.md)
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
- [ ] ER diagram approved

**Week 2:**
- [ ] ...

### Team Meetings
<!-- Add meeting notes -->

---

**Last Updated:** December 18, 2025
