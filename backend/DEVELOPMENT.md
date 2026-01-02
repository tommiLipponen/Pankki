# Development Guide - Adding New Features

**For Team Members: Step-by-Step Instructions**

This guide explains how to add new database tables and API endpoints to the Bank ATM system.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Adding a New Database Table](#adding-a-new-database-table)
3. [Step-by-Step Example: Accounts Table](#step-by-step-example-accounts-table)
4. [Testing Your Changes](#testing-your-changes)
5. [Common Mistakes to Avoid](#common-mistakes-to-avoid)

---

## 🏗️ Architecture Overview

Our backend follows a **3-layer architecture**:

```
Routes → Controllers → Services → Database (Prisma)
```

### Layer Responsibilities

**1. Routes** (`src/routes/`)
- Define API endpoints (URLs)
- Map HTTP methods to controller functions
- Include Swagger documentation

**2. Controllers** (`src/controllers/`)
- Handle HTTP requests and responses
- Validate input data
- Call service layer functions
- Format responses

**3. Services** (`src/services/`)
- Business logic
- Database operations via Prisma
- Data transformations

**4. Database** (`prisma/schema.prisma`)
- Database schema definition
- Table relationships
- Column types and constraints

---

## 🆕 Adding a New Database Table

Follow these steps **in order**:

### Step 1: Update Database Schema

**File:** `backend/prisma/schema.prisma`

Add your new model (table definition):

```prisma
model Account {
  id            Int      @id @default(autoincrement())
  customerId    Int      @map("customer_id")
  accountNumber String   @unique @map("account_number") @db.VarChar(20)
  balance       Decimal  @db.Decimal(15, 2)
  accountType   String   @map("account_type") @db.VarChar(50)
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  // Relations
  customer Customer @relation(fields: [customerId], references: [id])
  
  @@map("accounts") // Table name in database (lowercase)
}

// Don't forget to add the relation to Customer model:
model Customer {
  // ... existing fields
  accounts Account[] // ← Add this line
}
```

**Key Points:**
- Model name: PascalCase (`Account`)
- Database table: lowercase (`accounts`)
- Field names: camelCase (`customerId`)
- Database columns: snake_case (`customer_id`) using `@map()`

### Step 2: Create Migration

**Command:**
```bash
cd backend
npx prisma migrate dev --name add_accounts
```

**What happens:**
1. Creates a new migration file in `prisma/migrations/`
2. Applies the migration to your Azure MySQL database
3. Updates Prisma Client with new types

**Check if it worked:**
```bash
npx prisma studio
```
Opens a GUI - you should see your new table.

### Step 3: Create Service Layer

**File:** `backend/src/services/accountService.js`

**Copy from:** `customerService.js` and modify:

```javascript
const prisma = require('../config/database');

/**
 * Account Service
 * Handles all database operations for accounts
 */

const accountService = {
  // Get all accounts
  async getAllAccounts() {
    return await prisma.account.findMany({
      include: { customer: true } // Include customer data
    });
  },

  // Get account by ID
  async getAccountById(id) {
    return await prisma.account.findUnique({
      where: { id: parseInt(id) },
      include: { customer: true }
    });
  },

  // Create new account
  async createAccount(data) {
    return await prisma.account.create({
      data: {
        customerId: data.customerId,
        accountNumber: data.accountNumber,
        balance: data.balance,
        accountType: data.accountType
      },
      include: { customer: true }
    });
  },

  // Update account
  async updateAccount(id, data) {
    return await prisma.account.update({
      where: { id: parseInt(id) },
      data: {
        balance: data.balance,
        accountType: data.accountType
      },
      include: { customer: true }
    });
  },

  // Delete account
  async deleteAccount(id) {
    return await prisma.account.delete({
      where: { id: parseInt(id) }
    });
  }
};

module.exports = accountService;
```

### Step 4: Create Controller Layer

**File:** `backend/src/controllers/accountController.js`

**Copy from:** `customerController.js` and modify:

```javascript
const accountService = require('../services/accountService');

/**
 * Account Controller
 * Handles HTTP requests for account operations
 */

const accountController = {
  // GET /api/accounts
  async getAllAccounts(req, res, next) {
    try {
      const accounts = await accountService.getAllAccounts();
      res.json({
        success: true,
        data: accounts
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/accounts/:id
  async getAccountById(req, res, next) {
    try {
      const account = await accountService.getAccountById(req.params.id);
      if (!account) {
        return res.status(404).json({
          success: false,
          message: 'Account not found'
        });
      }
      res.json({
        success: true,
        data: account
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/accounts
  async createAccount(req, res, next) {
    try {
      // Validate required fields
      const { customerId, accountNumber, balance, accountType } = req.body;
      if (!customerId || !accountNumber || balance === undefined || !accountType) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      const account = await accountService.createAccount(req.body);
      res.status(201).json({
        success: true,
        data: account
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/accounts/:id
  async updateAccount(req, res, next) {
    try {
      const account = await accountService.updateAccount(req.params.id, req.body);
      res.json({
        success: true,
        data: account
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/accounts/:id
  async deleteAccount(req, res, next) {
    try {
      await accountService.deleteAccount(req.params.id);
      res.json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = accountController;
```

### Step 5: Create Routes

**File:** `backend/src/routes/accountRoutes.js`

**Copy from:** `customerRoutes.js` and modify:

```javascript
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: Account management
 */

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Get all accounts
 *     tags: [Accounts]
 *     responses:
 *       200:
 *         description: List of accounts
 */
router.get('/', accountController.getAllAccounts);

/**
 * @swagger
 * /api/accounts/{id}:
 *   get:
 *     summary: Get account by ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Account details
 *       404:
 *         description: Account not found
 */
router.get('/:id', accountController.getAccountById);

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Create new account
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - accountNumber
 *               - balance
 *               - accountType
 *             properties:
 *               customerId:
 *                 type: integer
 *               accountNumber:
 *                 type: string
 *               balance:
 *                 type: number
 *               accountType:
 *                 type: string
 *     responses:
 *       201:
 *         description: Account created
 */
router.post('/', accountController.createAccount);

/**
 * @swagger
 * /api/accounts/{id}:
 *   put:
 *     summary: Update account
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               balance:
 *                 type: number
 *               accountType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account updated
 */
router.put('/:id', accountController.updateAccount);

/**
 * @swagger
 * /api/accounts/{id}:
 *   delete:
 *     summary: Delete account
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Account deleted
 */
router.delete('/:id', accountController.deleteAccount);

module.exports = router;
```

### Step 6: Register Routes in Server

**File:** `backend/server.js`

Find the line with customer routes and add your new route below:

```javascript
// API Routes
app.use('/api/customers', customerRoutes);
app.use('/api/accounts', accountRoutes);  // ← Add this line

// Don't forget to import at the top:
const accountRoutes = require('./src/routes/accountRoutes');
```

### Step 7: Update Swagger Configuration

**File:** `backend/src/config/swagger.js`

Add schema definition for Account in the `components.schemas` section:

```javascript
Account: {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    customerId: { type: 'integer' },
    accountNumber: { type: 'string' },
    balance: { type: 'number', format: 'decimal' },
    accountType: { type: 'string', enum: ['checking', 'savings'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
}
```

### Step 8: Create Test File

**File:** `backend/tests/accounts.test.js`

**Copy from:** `health.test.js` and expand:

```javascript
const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../server.js');

describe('Accounts API', () => {
  it('should get all accounts', async () => {
    const response = await request(app)
      .get('/api/accounts')
      .expect('Content-Type', /json/)
      .expect(200);
    
    assert.strictEqual(response.body.success, true);
    assert.ok(Array.isArray(response.body.data));
  });

  // Add more tests for create, update, delete
});
```

---

## 🧪 Testing Your Changes

### 1. Test Locally

Start the development server:
```bash
cd backend
npm run dev
```

### 2. Check Swagger UI

Open: http://localhost:3000/api-docs

You should see your new "Accounts" section.

### 3. Test with REST Client

Create `backend/tests/accounts.http`:

```http
### Get all accounts
GET http://localhost:3000/api/accounts

### Get account by ID
GET http://localhost:3000/api/accounts/1

### Create account
POST http://localhost:3000/api/accounts
Content-Type: application/json

{
  "customerId": 1,
  "accountNumber": "FI1234567890",
  "balance": 1000.00,
  "accountType": "checking"
}

### Update account
PUT http://localhost:3000/api/accounts/1
Content-Type: application/json

{
  "balance": 1500.00,
  "accountType": "savings"
}

### Delete account
DELETE http://localhost:3000/api/accounts/1
```

### 4. Run Automated Tests

```bash
npm test
```

### 5. Commit and Push

```bash
git add .
git commit -m "Add Accounts table and API endpoints"
git push
```

GitHub Actions will automatically:
- Run tests
- Deploy migrations to Azure
- Deploy updated API

---

## ⚠️ Common Mistakes to Avoid

### 1. Forgetting to Run Migration
**Symptom:** Prisma Client doesn't recognize new model
**Solution:** Always run `npx prisma migrate dev` after changing schema

### 2. Naming Inconsistencies
**Wrong:**
```prisma
model account {  // ❌ Should be Account
  customer_id Int  // ❌ Use camelCase
  @@map("Account")  // ❌ Should be lowercase
}
```

**Correct:**
```prisma
model Account {  // ✅ PascalCase
  customerId Int @map("customer_id")  // ✅ camelCase + @map
  @@map("accounts")  // ✅ lowercase plural
}
```

### 3. Missing Relations
Always update both sides of a relationship:
```prisma
model Customer {
  accounts Account[]  // ✅ Don't forget this!
}

model Account {
  customer Customer @relation(fields: [customerId], references: [id])
}
```

### 4. Not Including Related Data
```javascript
// ❌ Returns account without customer info
await prisma.account.findUnique({ where: { id } });

// ✅ Includes customer data
await prisma.account.findUnique({
  where: { id },
  include: { customer: true }
});
```

### 5. Forgetting Error Handling
Always use try-catch in controllers:
```javascript
async createAccount(req, res, next) {
  try {
    // ... your code
  } catch (error) {
    next(error);  // ✅ Pass to error middleware
  }
}
```

### 6. Not Validating Input
```javascript
// ❌ Missing validation
const account = await accountService.createAccount(req.body);

// ✅ Validate first
const { customerId, accountNumber } = req.body;
if (!customerId || !accountNumber) {
  return res.status(400).json({ 
    success: false, 
    message: 'Missing required fields' 
  });
}
```

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Swagger/OpenAPI Spec](https://swagger.io/specification/)
- [Node:test Documentation](https://nodejs.org/api/test.html)

---

## 🆘 Getting Help

**If you're stuck:**
1. Check existing code (customerService.js, customerController.js, customerRoutes.js)
2. Review this guide
3. Ask team members on MS Teams
4. Check the error logs: `npm run dev` shows detailed errors

**Common Questions:**
- "Where do I put my code?" → Follow the 3-layer structure above
- "How do I test?" → Use REST Client (.http files) or Swagger UI
- "Migration failed?" → Check your schema syntax, ensure database is accessible
- "API not working?" → Check server.js to ensure routes are registered

---

**Last Updated:** January 2, 2026
