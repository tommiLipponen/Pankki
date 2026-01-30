# API Reference - OpenAPI Documentation

## ?? Overview

The `api-docs.json` file contains the **complete OpenAPI 3.0 specification** for the Bank ATM backend API. This document explains how to use it effectively.

---

## ? Purpose

### Why We Have This File:
1. **API Contract** - Single source of truth between frontend and backend teams
2. **Type Safety** - Reference for creating C++ data models that match backend schemas
3. **Documentation** - Complete endpoint details, parameters, and responses
4. **Synchronization** - Keep frontend aligned with backend changes

### What It's NOT:
- ? Not compiled into the application
- ? Not code generation input (we write models manually)
- ? Not a runtime dependency

---

## ?? How to Use This Documentation

### 1. Creating Data Models

When creating new C++ models (Account, Card, Transaction), reference the OpenAPI schemas:

**Example: Creating Account Model**

```cpp
// See api-docs.json ? components.schemas.Account

class Account {
public:
    // Properties from OpenAPI schema
    int id;                    // Auto-generated
    int customerId;            // Required
    QString accountNumber;     // maxLength: 20, example: "FI1234567890123456"
    double balance;            // Current balance (decimal)
    double creditLimit;        // Credit limit for CREDIT mode (decimal)
    bool isActive;             // Soft delete flag
    QDateTime createdAt;       // Auto-generated timestamp
    QDateTime updatedAt;       // Auto-updated timestamp
    
    // Methods (add as needed)
    QJsonObject toJson() const;
    void fromJson(const QJsonObject &json);
    bool isValid() const;
};
```

### 2. Understanding Endpoints

Check `api-docs.json` ? `paths` for endpoint details:

**Example: Authentication Flow**

```json
// Step 1: Insert Card
POST /api/auth/insert-card
Request: { "cardNumber": "1234567890123456" }
Response: { "availableCardMode": ["DEBIT", "CREDIT"] }

// Step 2: Verify PIN (get JWT token)
POST /api/auth/verify-pin
Request: { "cardNumber": "...", "pin": "1234", "cardMode": "DEBIT" }
Response: { "token": "eyJ...", "customer": {...}, "account": {...} }
```

### 3. Understanding Security

**JWT Authentication:**
- Required for: Accounts, Cards, Transactions endpoints
- Not required for: Customers, Health Check

```cpp
// In ApiClient, add Authorization header:
request.setRawHeader("Authorization", "Bearer " + jwtToken.toUtf8());
```

---

## ?? Updating the API Documentation

### When to Update:
- ? Backend adds new endpoints
- ? Backend changes request/response schemas
- ? Backend adds new data models
- ? Weekly (good practice)

### How to Update:

```bash
# Navigate to frontend folder
cd frontend

# Download latest spec from production
curl https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net/api-docs.json -o api-docs.json

# Or from local development server
curl http://localhost:3000/api-docs.json -o api-docs.json

# Commit the update
git add api-docs.json
git commit -m "docs: Update OpenAPI spec - [describe changes]"
```

---

## ?? Key API Sections

### Authentication (2-Step Flow)
```
1. POST /api/auth/insert-card  ? Validate card, get available modes
2. POST /api/auth/verify-pin   ? Verify PIN, get JWT token (60 days)
```

### Customers (No Auth Required)
```
GET    /api/customers        ? List all customers
POST   /api/customers        ? Create customer
GET    /api/customers/{id}   ? Get customer by ID
PUT    /api/customers/{id}   ? Update customer
DELETE /api/customers/{id}   ? Delete customer
```

### Accounts (JWT Required)
```
GET    /api/accounts         ? List all accounts
POST   /api/accounts         ? Create account
GET    /api/accounts/{id}    ? Get account by ID
PUT    /api/accounts/{id}    ? Update account
DELETE /api/accounts/{id}    ? Delete account
```

### Cards (JWT Required)
```
GET    /api/cards            ? List all cards
POST   /api/cards            ? Create card
GET    /api/cards/{id}       ? Get card by ID
PUT    /api/cards/{id}       ? Update card (lock/unlock, etc.)
DELETE /api/cards/{id}       ? Delete card
```

### Transactions (JWT Required)
```
POST   /api/transactions                    ? Create transaction (WITHDRAWAL, DEPOSIT, etc.)
POST   /api/transactions/transfer           ? Transfer between accounts
GET    /api/transactions/account/{id}       ? Get account transactions
GET    /api/transactions/card/{id}          ? Get card transactions
GET    /api/transactions/{id}               ? Get transaction by ID
```

---

## ?? Data Models Reference

### Customer
```cpp
int id;
QString firstName;      // maxLength: 100
QString lastName;       // maxLength: 100
QString address;        // maxLength: 255
QDateTime createdAt;
QDateTime updatedAt;
```

### Account
```cpp
int id;
int customerId;
QString accountNumber;  // maxLength: 20, example: "FI1234567890123456"
double balance;         // Current balance
double creditLimit;     // For CREDIT mode transactions
bool isActive;          // Soft delete
QDateTime createdAt;
QDateTime updatedAt;
```

### Card
```cpp
int id;
int accountId;
int customerId;
QString cardNumber;         // 16 digits, unique
QString pinHash;            // bcrypt hash (not plain text!)
QDateTime expiryDate;
bool isLocked;              // Auto-locked after 3 failed PIN attempts
int failedPinAttempts;      // Counter (0-3)
QDateTime lastFailedAttempt;// Nullable
bool isActive;              // Soft delete
QDateTime createdAt;
QDateTime updatedAt;
```

### Transaction
```cpp
int id;
int accountId;
int cardId;                        // Nullable (for system transactions)
QString transactionType;           // DEPOSIT, WITHDRAWAL, TRANSFER_IN, TRANSFER_OUT
QString cardMode;                  // DEBIT, CREDIT (nullable)
double amount;                     // Always positive
double balanceAfter;               // Balance after transaction
QString description;               // Nullable, maxLength: 255
QDateTime createdAt;
```

---

## ?? Security Notes

### PIN Security:
- PINs stored as **bcrypt hashes** (never plain text)
- 10 rounds of hashing
- Card **auto-locks** after 3 failed attempts
- Counter resets to 0 on successful login

### JWT Token:
- Expires in **60 days**
- Contains: cardId, accountId, customerId, cardMode
- Required for authenticated endpoints
- Include in headers: `Authorization: Bearer <token>`

### Card Modes:
- **DEBIT**: Balance must stay >= 0
- **CREDIT**: Balance can go to -creditLimit
- Mode selected during authentication (Step 2)

---

## ??? Integration Checklist

When integrating a new endpoint:

- [ ] Read endpoint details in `api-docs.json` ? `paths`
- [ ] Check required authentication (`security` field)
- [ ] Create C++ model class (if new entity)
- [ ] Add method to `ApiClient` class
- [ ] Handle response in UI (MainWindow or new screen)
- [ ] Test with actual backend
- [ ] Update this document if needed

---

## ?? Questions?

If OpenAPI spec is unclear or seems outdated:
1. Check backend Swagger UI: https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net/api-docs
2. Ask backend team for clarification
3. Update `api-docs.json` with latest version

---

**Last Updated:** January 2026  
**Backend Version:** 1.0.0  
**API Base URL (Production):** https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net
