# Bank ATM Backend API

REST API for Bank ATM System using Node.js, Express, and Prisma ORM.
## 🚀 Current Status (Week 2 Complete)

✅ **Completed:**
- Customer management (CRUD operations)
- MySQL database with Prisma ORM
- API documentation with Swagger
- Automated testing with Jest
- CI/CD pipeline with GitHub Actions
- Azure deployment
- Qt C++ desktop frontend connected

## 📋 Development Roadmap

### Week 3: Core Banking Features (In Progress)
- [ ] **Accounts Table** - Bank accounts linked to customers
- [ ] **Cards Table** - ATM card information (without auth)
- [ ] **Transactions Table** - Transaction history
- [ ] **Account Operations** - Deposit, withdrawal, transfer endpoints
- [ ] **Balance Management** - Account balance tracking
- [ ] **Frontend Integration** - Connect Qt app to new endpoints

### Week 4: Security & Authentication
- [ ] **JWT Authentication** - Two-step auth (card + PIN)
  - Card insertion simulation (validate card number)
  - PIN verification (4-digit code)
  - JWT token generation (no refresh tokens)
  - Protected endpoints with Bearer authentication
- [ ] **Password Hashing** - Secure PIN storage with bcrypt
- [ ] **Auth Middleware** - Protect all banking operations
- [ ] **Qt Auth Flow** - Frontend authentication implementation

### Week 5: Polish & Testing
- [ ] **Error Handling** - Comprehensive error responses
- [ ] **Input Validation** - Data validation improvements
- [ ] **Integration Tests** - Full workflow testing
- [ ] **Documentation** - Complete API documentation
- [ ] **Code Review** - Final cleanup and optimization
## � For Developers

**New to the project?** Start here:
- 📖 [DEVELOPMENT.md](DEVELOPMENT.md) - Complete guide for adding new features and database tables

## �📁 Project Structure

```
backend/
├── src/
│   ├── controllers/    # Request handlers (business logic)
│   ├── routes/         # API endpoint definitions
│   ├── middleware/     # Express middleware (CORS, error handling)
│   ├── services/       # Database operations (Prisma)
│   ├── utils/          # Helper functions
│   └── config/         # Configuration files
├── prisma/
│   ├── schema.prisma   # Database schema
│   ├── migrations/     # Migration history
│   └── seed.js         # Test data (optional)
├── public/             # Static files (images)
├── swagger/            # API documentation
├── tests/              # Unit/integration tests
├── .env.example        # Environment template
├── server.js           # Application entry point
└── package.json        # Dependencies and scripts
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

<!-- TODO: Add ER diagram image here after creating it -->

### Main Tables
- `customers` - Customer information
- `accounts` - Bank accounts (debit/credit)
- `cards` - ATM cards with PIN
- `transactions` - Transaction history
- `card_accounts` - Linking table for dual cards (grade 5)

## � Authentication (Week 4)

JWT authentication will be implemented with two-step verification:

1. **Card Insertion:** Validate 16-digit card number
2. **PIN Entry:** Verify 4-digit PIN code
3. **Token Generation:** Receive JWT for subsequent requests
4. **Protected Access:** All banking operations require valid token

**Auth Flow:**
```
POST /api/auth/insert-card → cardId
POST /api/auth/verify-pin → JWT token
GET /api/customers → Authorization: Bearer {token}
```

## 🔒 Security

- PINs will be hashed using bcrypt (Week 4)
- Environment variables for sensitive data
- CORS configured for Qt application
- Input validation on all endpoints

## 📚 API Endpoints

### Authentication
- `POST /api/auth/validate-pin` - Validate card and PIN

### Accounts
- `GET /api/accounts/:id` - Get account details
- `GET /api/accounts/:id/balance` - Check balance
- `GET /api/accounts/:id/transactions` - Get transaction history

### Transactions
- `POST /api/transactions/withdraw` - Withdraw money

### CRUD Operations (Required for grade 2+)
- Customers: GET, POST, PUT, DELETE
- Accounts: GET, POST, PUT, DELETE
- Cards: GET, POST, PUT, DELETE
- Transactions: GET, POST

## 🧪 Testing

Run tests:
```bash
npm test
```

With coverage report:
```bash
npm run test:watch
```

## 🚢 Deployment

<!-- TODO: Add Azure deployment instructions -->

## � Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   └── database.js        # Prisma client
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification (Week 4)
│   ├── routes/
│   │   ├── customerRoutes.js  # Customer endpoints
│   │   └── authRoutes.js      # Auth endpoints (Week 4)
│   ├── services/
│   │   ├── customerService.js # Business logic
│   │   └── authService.js     # Auth logic (Week 4)
│   ├── swagger/
│   │   ├── swaggerConfig.js   # Swagger setup
│   │   └── schemas.js         # Swagger schemas
│   └── app.js                 # Express app
├── tests/
│   └── customer.test.js       # API tests
├── .env                       # Environment variables (not in Git)
├── package.json
└── README.md
```

## 👥 Team

- Tommi Lipponen
- Iisa Metsola  
- Topi Pietilänaho
- Tommy Näsänen

**Course:** Application Project Spring 2026  
**Organization:** Oulu University of Applied Sciences (OAMK)

## 🔗 Links

- **Production API:** https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net
- **API Docs:** https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net/api-docs
- **Repository:** https://github.com/25kmo-project/group_1
- **Qt Frontend:** [`/frontend`](../frontend)

## 📝 License

Educational project - OAMK Application Project Course 2026
- Member 4: [Role]

## 📄 License

MIT License - School Project
