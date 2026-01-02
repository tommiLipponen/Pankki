# Bank ATM Backend API

REST API for Bank ATM System using Node.js, Express, and Prisma ORM.

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

## 🔒 Security

- PINs are hashed using bcrypt (10 rounds)
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

## 👥 Team Members

- Member 1: [Role]
- Member 2: [Role]
- Member 3: [Role]
- Member 4: [Role]

## 📄 License

MIT License - School Project
