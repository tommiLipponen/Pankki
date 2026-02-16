# API Specification / API-määrittely

Tämä dokumentti sisältää yksityiskohtaisen API-määrittelyn OpenAPI 3.0 -standardin mukaisesti.

This document contains detailed API specification following OpenAPI 3.0 standard.

---

## Table of Contents / Sisällysluettelo

1. [API Overview](#api-overview--yleiskatsaus)
2. [OpenAPI 3.0 Specification](#openapi-30-specification)
3. [Endpoint Details](#endpoint-details--päätepisteiden-kuvaukset)
4. [Authentication](#authentication--autentikointi)
5. [Error Handling](#error-handling--virheiden-käsittely)
6. [Data Models](#data-models--tietomallit)
7. [Swagger UI Usage](#swagger-ui-usage)

---

## API Overview / Yleiskatsaus

**Base URL:**  
`https://bank-atm-backend-h5bybufaegbnbvaf.swedencentral-01.azurewebsites.net`

**API Version:** 1.0.0  
**Protocol:** HTTPS  
**Authentication:** JWT Bearer Token (for protected endpoints)  
**Data Format:** JSON (application/json)

**Deployment:**
- Platform: Azure App Service
- Region: Sweden Central
- Tier: Basic B1
- Runtime: Node.js 20.x
- Database: Azure MySQL 8.0

---

## OpenAPI 3.0 Specification

```yaml
openapi: 3.0.3
info:
  title: Bank ATM API
  description: |
    REST API for ATM banking operations including card authentication, 
    PIN verification, withdrawals, and transaction history.
    
    **Key Features:**
    - Card validation (DEBIT/CREDIT modes)
    - JWT-based authentication
    - Secure withdrawals using MySQL stored procedures
    - Transaction history with pagination support
    
    **Security:**
    - bcrypt password hashing (cost factor: 10)
    - JWT tokens with 1-hour expiry
    - ACID-compliant stored procedures for financial transactions
    
  version: 1.0.0
  contact:
    name: Bank ATM Development Team
    email: support@example.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://bank-atm-backend-h5bybufaegbnbvaf.swedencentral-01.azurewebsites.net
    description: Azure Production Server (Sweden Central)

tags:
  - name: Health
    description: API health and connectivity checks
  - name: Cards
    description: Card validation and authentication
  - name: Authentication
    description: PIN verification and JWT token generation
  - name: Transactions
    description: Withdrawal operations and transaction history

paths:
  /health:
    get:
      tags:
        - Health
      summary: Health check endpoint
      description: |
        Verifies that the backend server is running and responsive.
        Used to wake up Azure App Service from sleep mode (Basic tier).
        No authentication required.
      operationId: healthCheck
      responses:
        '200':
          description: Server is healthy and operational
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: OK
                  timestamp:
                    type: string
                    format: date-time
                    example: "2025-01-20T12:00:00.000Z"
        '500':
          description: Server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /api/cards/authenticate:
    post:
      tags:
        - Cards
      summary: Authenticate card number
      description: |
        Validates that a card number exists in the database and is active (not blocked).
        Returns available card modes (DEBIT/CREDIT) for the card.
      operationId: authenticateCard
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - cardNumber
              properties:
                cardNumber:
                  type: string
                  pattern: '^\d{16}$'
                  description: 16-digit card number
                  example: "1234567890123456"
      responses:
        '200':
          description: Card authentication successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  modes:
                    type: array
                    items:
                      type: string
                      enum: [DEBIT, CREDIT]
                    example: ["DEBIT", "CREDIT"]
                  cardId:
                    type: integer
                    example: 1
                  customerId:
                    type: integer
                    example: 42
        '400':
          description: Invalid card number format
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Card not found or blocked
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: false
                  message:
                    type: string
                    example: "Card not found or blocked"

  /api/auth/verify-pin:
    post:
      tags:
        - Authentication
      summary: Verify PIN and generate JWT token
      description: |
        Verifies the PIN code for a given card and mode.
        On success, returns a JWT token and user account data.
        PIN is hashed using bcrypt before comparison.
      operationId: verifyPin
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - cardNumber
                - pin
                - mode
              properties:
                cardNumber:
                  type: string
                  pattern: '^\d{16}$'
                  description: 16-digit card number
                  example: "1234567890123456"
                pin:
                  type: string
                  pattern: '^\d{4}$'
                  description: 4-digit PIN code
                  example: "1234"
                mode:
                  type: string
                  enum: [DEBIT, CREDIT]
                  description: Card mode to use for this session
                  example: "DEBIT"
      responses:
        '200':
          description: PIN verification successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                    description: JWT token (valid for 1 hour)
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  userData:
                    type: object
                    properties:
                      customerId:
                        type: integer
                        example: 42
                      userName:
                        type: string
                        example: "Matti Meikäläinen"
                      accountId:
                        type: integer
                        example: 100
                      accountNumber:
                        type: string
                        example: "FI1234567890"
                      balance:
                        type: string
                        description: Account balance (may include $ suffix)
                        example: "490.00$"
                      creditLimit:
                        type: string
                        description: Credit limit for CREDIT mode (may include $ suffix)
                        example: "500.00$"
        '400':
          description: Invalid request (missing fields or wrong format)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Invalid PIN
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: false
                  message:
                    type: string
                    example: "Invalid PIN"

  /api/transactions/withdraw:
    post:
      tags:
        - Transactions
      summary: Process cash withdrawal
      description: |
        Processes a withdrawal using MySQL stored procedure for ACID guarantees.
        Validates balance based on card mode (DEBIT: balance >= amount, CREDIT: balance + creditLimit >= amount).
        Updates account balance and creates transaction record atomically.
      operationId: withdraw
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - amount
              properties:
                amount:
                  type: number
                  format: double
                  minimum: 0.01
                  description: Withdrawal amount in euros
                  example: 50.0
      responses:
        '200':
          description: Withdrawal successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  balanceAfter:
                    type: string
                    description: New account balance after withdrawal
                    example: "440.00"
                  amount:
                    type: string
                    description: Withdrawn amount
                    example: "50.00"
                  transactionId:
                    type: integer
                    description: ID of created transaction record
                    example: 123
                  timestamp:
                    type: string
                    format: date-time
                    example: "2025-01-20T10:30:00.000Z"
        '400':
          description: Invalid amount or insufficient funds
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: false
                  message:
                    type: string
                    example: "Insufficient funds for withdrawal"
        '401':
          description: Unauthorized (invalid or expired JWT token)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /api/transactions/account/{accountId}:
    get:
      tags:
        - Transactions
      summary: Get transaction history
      description: |
        Retrieves all transactions for a given account, ordered by newest first.
        Used for displaying transaction history in the ATM interface.
        Frontend implements pagination (10 transactions per page).
      operationId: getTransactions
      security:
        - bearerAuth: []
      parameters:
        - name: accountId
          in: path
          required: true
          schema:
            type: integer
          description: Account ID to fetch transactions for
          example: 100
      responses:
        '200':
          description: Transaction history retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Transaction'
        '401':
          description: Unauthorized (invalid or expired JWT token)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Account not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: |
        JWT token obtained from /api/auth/verify-pin endpoint.
        Token is valid for 1 hour.
        Include in Authorization header as: Bearer <token>

  schemas:
    Error:
      type: object
      properties:
        success:
          type: boolean
          example: false
        message:
          type: string
          example: "Error message describing what went wrong"
        error:
          type: string
          description: Technical error details (only in development mode)
          example: "Database connection timeout"

    Transaction:
      type: object
      properties:
        transactionType:
          type: string
          enum: [WITHDRAW, DEPOSIT]
          example: "WITHDRAW"
        amount:
          type: string
          description: Transaction amount (formatted as string with 2 decimals)
          example: "50.00"
        balanceAfter:
          type: string
          description: Account balance after transaction
          example: "440.00"
        createdAt:
          type: string
          format: date-time
          description: Transaction timestamp (ISO 8601 format)
          example: "2025-01-20T10:30:00.000Z"

    CardMode:
      type: string
      enum: [DEBIT, CREDIT]
      description: |
        Card operation mode:
        - DEBIT: Uses account balance only
        - CREDIT: Uses account balance + credit limit

    CardStatus:
      type: string
      enum: [ACTIVE, BLOCKED]
      description: Card status in the system
```

---

## Endpoint Details / Päätepisteiden Kuvaukset

### 1. Health Check

**Purpose:** Verify backend availability and wake up Azure App Service from sleep mode.

**Endpoint:** `GET /health`  
**Authentication:** None  
**Rate Limit:** None

**Use Cases:**
- Frontend connection status indicator (polls every 30 seconds)
- DevOps monitoring and health checks
- Wake up Azure App Service after 20 minutes of inactivity

**Response Time:**
- Normal: 50-200ms
- Cold start (Azure waking up): 30-60 seconds

---

### 2. Card Authentication

**Purpose:** Validate card number and retrieve available card modes.

**Endpoint:** `POST /api/cards/authenticate`  
**Authentication:** None  
**Database Access:** Prisma ORM

**Business Logic:**
1. Validate card number format (16 digits)
2. Check if card exists in `cards` table
3. Verify card status is ACTIVE (not BLOCKED)
4. Query `card_accounts` junction table for available modes
5. Return list of modes (DEBIT, CREDIT, or both)

**Validation Rules:**
- Card number must be exactly 16 digits
- Card must exist in database
- Card status must be ACTIVE

**Error Scenarios:**
- Card not found → 404 "Card not found or blocked"
- Card blocked → 404 "Card not found or blocked"
- Invalid format → 400 "Invalid card number format"

---

### 3. PIN Verification

**Purpose:** Authenticate user with PIN code and issue JWT token.

**Endpoint:** `POST /api/auth/verify-pin`  
**Authentication:** None (but issues JWT token)  
**Database Access:** Prisma ORM

**Business Logic:**
1. Validate PIN format (4 digits)
2. Find card by card number
3. Get PIN hash for selected card mode from `card_accounts`
4. Compare PIN with bcrypt hash
5. Aggregate user data:
   - Customer name from `customers` table
   - Account number and balance from `accounts` table
   - Credit limit (if CREDIT mode)
6. Generate JWT token with 1-hour expiry
7. Return token + user data

**Security Features:**
- bcrypt password hashing (cost factor: 10)
- JWT tokens with HS256 algorithm
- Token payload includes: `customerId`, `accountId`, `accountNumber`, `cardMode`
- Token lifetime: 1 hour (3600 seconds)

**Validation Rules:**
- PIN must be exactly 4 digits
- Card mode must be one of the available modes for this card
- PIN hash must match

**Error Scenarios:**
- Invalid PIN → 401 "Invalid PIN"
- Card mode not available → 400 "Invalid card mode"
- Missing fields → 400 "Missing required fields"

---

### 4. Cash Withdrawal

**Purpose:** Process withdrawal using stored procedure for ACID guarantees.

**Endpoint:** `POST /api/transactions/withdraw`  
**Authentication:** JWT Bearer Token (required)  
**Database Access:** MySQL2 Pool (stored procedure) + Prisma ORM

**Business Logic:**
1. Verify JWT token and extract `accountId`, `cardMode`
2. Validate withdrawal amount (must be > 0)
3. Call `withdraw_money` stored procedure with:
   - `accountId`
   - `amount`
   - `cardMode` (for balance validation logic)
4. Stored procedure performs:
   - SELECT FOR UPDATE (row-level lock)
   - Balance validation based on card mode
   - UPDATE accounts SET balance = balance - amount
   - INSERT INTO transactions (type, amount, balance_after)
   - COMMIT transaction
5. Return new balance + transaction details

**Balance Validation (in stored procedure):**
```sql
-- DEBIT mode
IF balance < amount THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient funds';
END IF;

-- CREDIT mode
IF balance + credit_limit < amount THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient funds';
END IF;
```

**ACID Guarantees:**
- Atomicity: Balance update + transaction log insert in single transaction
- Consistency: Balance validation prevents negative balances
- Isolation: Row-level locking prevents concurrent withdrawal race conditions
- Durability: MySQL commits changes to disk before returning success

**Error Scenarios:**
- Insufficient funds → 400 "Insufficient funds for withdrawal"
- Invalid amount → 400 "Invalid amount"
- Invalid token → 401 "Unauthorized"
- Expired token → 401 "Token expired"

---

### 5. Transaction History

**Purpose:** Retrieve transaction history for display in ATM interface.

**Endpoint:** `GET /api/transactions/account/:accountId`  
**Authentication:** JWT Bearer Token (required)  
**Database Access:** Prisma ORM

**Business Logic:**
1. Verify JWT token and extract `accountId`
2. Validate token's accountId matches requested accountId
3. Query `transactions` table:
   - Filter by `account_id`
   - Order by `created_at DESC` (newest first)
4. Return array of transactions (no pagination in backend - handled by frontend)

**Data Format:**
- Transaction type: WITHDRAW or DEPOSIT
- Amount: String with 2 decimal places
- Balance after: String with 2 decimal places
- Created at: ISO 8601 timestamp

**Frontend Pagination:**
- Frontend (TransactionManager) implements pagination
- 10 transactions per page
- Previous/Next navigation buttons

**Error Scenarios:**
- Invalid token → 401 "Unauthorized"
- AccountId mismatch → 403 "Forbidden"
- Account not found → 404 "Account not found"

---

## Authentication / Autentikointi

### JWT Token Structure

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "customerId": "42",
  "accountId": "100",
  "accountNumber": "FI1234567890",
  "cardMode": "CREDIT",
  "iat": 1674120000,
  "exp": 1674123600
}
```

**Signature:**
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  SECRET_KEY
)
```

### Token Lifetime

- **Duration:** 1 hour (3600 seconds)
- **Issued At (iat):** Unix timestamp when token was created
- **Expires (exp):** Unix timestamp when token expires
- **Refresh:** Not supported - user must re-authenticate with PIN

### Using JWT Token in Requests

**Authorization Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Qt Frontend Implementation:**
```cpp
void ApiClient::withdrawMoney(double amount, QString jwtToken) {
    QNetworkRequest request(QUrl(baseUrl + "/api/transactions/withdraw"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    
    // Add JWT token to Authorization header
    request.setRawHeader("Authorization", ("Bearer " + jwtToken).toUtf8());
    
    QJsonObject json;
    json["amount"] = amount;
    
    networkManager->post(request, QJsonDocument(json).toJson());
}
```

### Token Validation (Backend Middleware)

```javascript
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract "Bearer <token>"
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }
        
        req.user = decoded; // Store decoded token data in request
        next();
    });
}
```

---

## Error Handling / Virheiden Käsittely

### Standard Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical error details (development mode only)"
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid input data (validation failed) |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource not found (card, account, etc.) |
| 500 | Internal Server Error | Unexpected server error |

### Common Error Messages

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Card not found or blocked" | Card doesn't exist or status is BLOCKED | Verify card number |
| "Invalid PIN" | PIN hash doesn't match | Re-enter PIN |
| "Insufficient funds for withdrawal" | Balance < amount (DEBIT) or balance + credit < amount (CREDIT) | Reduce withdrawal amount |
| "Invalid or expired token" | JWT token expired or invalid signature | Re-authenticate with PIN |
| "No token provided" | Authorization header missing | Include JWT token in header |
| "Invalid amount" | Amount <= 0 or not a number | Enter valid positive amount |
| "Missing required fields" | Request body missing fields | Include all required fields |

### Error Handling in Frontend (Qt)

```cpp
void MainWindow::onApiError(QString message) {
    qDebug() << "=== API ERROR ===";
    qDebug() << "Error message:" << message;
    
    QLabel* errorLabel = nullptr;
    
    // Select error label based on current page
    if (ui->stackedWidget->currentIndex() == 0) {
        errorLabel = ui->errorLabel; // Insert Card page
    } else if (ui->stackedWidget->currentIndex() == 1) {
        errorLabel = ui->errorLabel_2; // PIN page
    }
    
    if (errorLabel) {
        errorLabel->setText(message);
        errorLabel->setVisible(true);
    }
}
```

---

## Data Models / Tietomallit

### Database Schema (MySQL)

```sql
-- Customers table
CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    address VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Accounts table
CREATE TABLE accounts (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0.00,
    credit_limit DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Cards table
CREATE TABLE cards (
    card_id INT PRIMARY KEY AUTO_INCREMENT,
    card_number VARCHAR(16) UNIQUE NOT NULL,
    status ENUM('ACTIVE', 'BLOCKED') DEFAULT 'ACTIVE',
    customer_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Card-Account junction table (many-to-many with card modes)
CREATE TABLE card_accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    card_id INT NOT NULL,
    account_id INT NOT NULL,
    card_mode ENUM('DEBIT', 'CREDIT') NOT NULL,
    pin_hash VARCHAR(255) NOT NULL, -- bcrypt hash
    FOREIGN KEY (card_id) REFERENCES cards(card_id),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id),
    UNIQUE KEY unique_card_account_mode (card_id, account_id, card_mode)
);

-- Transactions table
CREATE TABLE transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT NOT NULL,
    transaction_type ENUM('WITHDRAW', 'DEPOSIT') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id),
    INDEX idx_account_created (account_id, created_at DESC)
);
```

### Stored Procedure: withdraw_money

```sql
DELIMITER $$

CREATE PROCEDURE withdraw_money(
    IN p_account_id INT,
    IN p_amount DECIMAL(10,2),
    IN p_card_mode VARCHAR(10)
)
BEGIN
    DECLARE v_balance DECIMAL(10,2);
    DECLARE v_credit_limit DECIMAL(10,2);
    DECLARE v_new_balance DECIMAL(10,2);
    
    -- Start transaction
    START TRANSACTION;
    
    -- Lock row for update (prevent race conditions)
    SELECT balance, credit_limit 
    INTO v_balance, v_credit_limit
    FROM accounts 
    WHERE account_id = p_account_id 
    FOR UPDATE;
    
    -- Validate balance based on card mode
    IF p_card_mode = 'DEBIT' THEN
        IF v_balance < p_amount THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Insufficient funds for withdrawal';
        END IF;
    ELSEIF p_card_mode = 'CREDIT' THEN
        IF (v_balance + v_credit_limit) < p_amount THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Insufficient funds for withdrawal';
        END IF;
    END IF;
    
    -- Update balance
    SET v_new_balance = v_balance - p_amount;
    UPDATE accounts 
    SET balance = v_new_balance 
    WHERE account_id = p_account_id;
    
    -- Insert transaction record
    INSERT INTO transactions (account_id, transaction_type, amount, balance_after)
    VALUES (p_account_id, 'WITHDRAW', p_amount, v_new_balance);
    
    -- Commit transaction
    COMMIT;
    
    -- Return new balance
    SELECT v_new_balance AS balanceAfter;
END$$

DELIMITER ;
```

---

## Swagger UI Usage

### Viewing the API Specification

**Option 1: Swagger Editor (Online)**

1. Go to https://editor.swagger.io/
2. Copy the OpenAPI YAML spec from this document
3. Paste into the left panel
4. View formatted documentation in right panel
5. Test endpoints using "Try it out" feature

**Option 2: VSCode Extension**

1. Install "Swagger Viewer" extension
2. Open this markdown file in VSCode
3. Right-click YAML code block → "Preview Swagger"
4. View interactive documentation

**Option 3: Swagger UI (Local)**

```bash
# Install Swagger UI
npm install -g swagger-ui-watcher

# Create api-spec.yaml file with the YAML from above
# Watch and serve the spec
swagger-ui-watcher api-spec.yaml
```

### Testing Endpoints

**Step 1: Test Health Check**
```bash
curl -X GET https://bank-atm-backend-h5bybufaegbnbvaf.swedencentral-01.azurewebsites.net/health
```

**Step 2: Authenticate Card**
```bash
curl -X POST \
  https://bank-atm-backend-h5bybufaegbnbvaf.swedencentral-01.azurewebsites.net/api/cards/authenticate \
  -H 'Content-Type: application/json' \
  -d '{
    "cardNumber": "1234567890123456"
  }'
```

**Step 3: Verify PIN and Get JWT Token**
```bash
curl -X POST \
  https://bank-atm-backend-h5bybufaegbnbvaf.swedencentral-01.azurewebsites.net/api/auth/verify-pin \
  -H 'Content-Type: application/json' \
  -d '{
    "cardNumber": "1234567890123456",
    "pin": "1234",
    "mode": "DEBIT"
  }'
```

**Step 4: Withdraw Money (requires JWT token)**
```bash
curl -X POST \
  https://bank-atm-backend-h5bybufaegbnbvaf.swedencentral-01.azurewebsites.net/api/transactions/withdraw \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <YOUR_JWT_TOKEN>' \
  -d '{
    "amount": 50.0
  }'
```

**Step 5: Get Transaction History**
```bash
curl -X GET \
  https://bank-atm-backend-h5bybufaegbnbvaf.swedencentral-01.azurewebsites.net/api/transactions/account/100 \
  -H 'Authorization: Bearer <YOUR_JWT_TOKEN>'
```

---

## Rate Limiting & Performance

**Current Implementation:**
- No rate limiting (Azure App Service default)
- Cold start time: 30-60 seconds (Azure Basic tier)
- Normal response time: 50-200ms
- Health check polling: Every 30 seconds from frontend

**Recommendations for Production:**
- Add rate limiting middleware (express-rate-limit)
- Implement request caching for frequently accessed data
- Upgrade to Azure Standard tier to eliminate cold starts
- Add Redis cache for session management

---

## CORS Configuration

**Current Settings:**
```javascript
app.use(cors({
    origin: '*', // Allow all origins (development)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Production Recommendation:**
```javascript
app.use(cors({
    origin: 'https://your-atm-frontend.azurewebsites.net', // Specific origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
```

---

## References / Viitteet

- **OpenAPI Specification:** https://swagger.io/specification/
- **Swagger Editor:** https://editor.swagger.io/
- **JWT.io Debugger:** https://jwt.io/
- **bcrypt Documentation:** https://www.npmjs.com/package/bcrypt
- **Prisma ORM:** https://www.prisma.io/docs
- **Azure App Service:** https://learn.microsoft.com/en-us/azure/app-service/

**Related Documentation:**
- `API_REFERENCE.md` - Detailed API endpoint documentation
- `TEST_CREDENTIALS.md` - Test user accounts and card numbers
- `docs/component-diagram.md` - System architecture
- `docs/component-descriptions.md` - Component details
- `docs/ui-description.md` - Frontend UI state diagram

**Dokumentti päivitetty / Document Updated:** 2025-01-20
