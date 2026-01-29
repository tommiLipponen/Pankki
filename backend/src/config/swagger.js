// Swagger Configuration
// OpenAPI 3.0 documentation setup

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bank ATM API',
      version: '1.0.0',
      description: 'REST API for Bank ATM system - Customer management',
      contact: {
        name: 'Bank ATM Team',
        email: 'team@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://pankki-api-dcb8eubhg5c5eya6.swedencentral-01.azurewebsites.net',
        description: 'Production server (Azure)'
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'ATM authentication endpoints (2-step flow: insert card → verify PIN → get JWT token)'
      },
      {
        name: 'Customers',
        description: 'Customer management endpoints'
      },
      {
        name: 'Accounts',
        description: 'Account management endpoints (requires JWT authentication)'
      },
      {
        name: 'Cards',
        description: 'Card management endpoints (requires JWT authentication)'
      },
      {
        name: 'Transactions',
        description: 'Transaction processing endpoints with debit/credit mode support (requires JWT authentication)'
      },
      {
        name: 'Health',
        description: 'System health check'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from POST /api/auth/verify-pin. Include as: Authorization: Bearer <token>'
        }
      },
      schemas: {
        Customer: {
          type: 'object',
          required: ['firstName', 'lastName', 'address'],
          properties: {
            id: {
              type: 'integer',
              description: 'Auto-generated customer ID',
              example: 1
            },
            firstName: {
              type: 'string',
              description: 'Customer first name',
              maxLength: 100,
              example: 'Matti'
            },
            lastName: {
              type: 'string',
              description: 'Customer last name',
              maxLength: 100,
              example: 'Meikäläinen'
            },
            address: {
              type: 'string',
              description: 'Customer address',
              maxLength: 255,
              example: 'Kauppurienkatu 1, 90100 Oulu'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when customer was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when customer was last updated'
            }
          }
        },
        CustomerInput: {
          type: 'object',
          required: ['firstName', 'lastName', 'address'],
          properties: {
            firstName: {
              type: 'string',
              description: 'Customer first name',
              maxLength: 100,
              example: 'Matti'
            },
            lastName: {
              type: 'string',
              description: 'Customer last name',
              maxLength: 100,
              example: 'Meikäläinen'
            },
            address: {
              type: 'string',
              description: 'Customer address',
              maxLength: 255,
              example: 'Kauppurienkatu 1, 90100 Oulu'
            }
          }
        },
        Account: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Auto-generated account ID',
              example: 1
            },
            customerId: {
              type: 'integer',
              description: 'Customer ID who owns this account',
              example: 1
            },
            accountNumber: {
              type: 'string',
              description: 'Unique account number',
              maxLength: 20,
              example: 'FI1234567890123456'
            },
            balance: {
              type: 'number',
              format: 'decimal',
              description: 'Current account balance',
              example: 1000.00
            },
            creditLimit: {
              type: 'number',
              format: 'decimal',
              description: 'Credit limit for CREDIT mode transactions',
              example: 500.00
            },
            isActive: {
              type: 'boolean',
              description: 'Account active status (soft delete)',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when account was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when account was last updated'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              oneOf: [
                { $ref: '#/components/schemas/Customer' },
                {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Customer' }
                }
              ]
            },
            message: {
              type: 'string',
              example: 'Operation successful'
            },
            count: {
              type: 'integer',
              example: 10
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Detailed error (development only)'
            }
          }
        },

        Card: {
          type: 'object',
          required: ['accountId', 'cardNumber', 'customerId','pinHash','expiryDate'],
          properties: {
            id: {
              type: 'integer',
              description: 'Auto-generated card ID',
              example: 1
            },
            accountId: {
              type: 'integer',
              description: 'Account ID associated with this card',
              example: 1
            },
            cardNumber: {
              type: 'string',
              description: 'Unique card number',
              maxLength: 16,
              minLength: 16,
              example: '1234567812345678'
            },
            customerId: {
              type: 'integer',
              description: 'Customer ID who owns this card',
              example: 1
            },
            pinHash: {
              type: 'string',
              description: 'Hashed PIN code for card authentication',
              example: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
            },
            expiryDate: {
              type: 'string',
              format: 'date-time',
              description: 'Card expiry date',
              example: '2025-12-31T23:59:59Z'
            },
            isLocked: {
              type: 'boolean',
              description: 'Card lock status',
              example: false
            },
            isActive: {
              type: 'boolean',
              description: 'Card active status (soft delete)',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when card was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when card was last updated'
            }
          }
        },

        Transaction: {
          type: 'object',
          required: ['accountId', 'transactionType', 'amount'],
          properties: {
            id: {
              type: 'integer',
              description: 'Auto-generated transaction ID',
              example: 1
            },
            accountId: {
              type: 'integer',
              description: 'Account ID associated with transaction',
              example: 1
            },
            cardId: {
              type: 'integer',
              nullable: true,
              description: 'Card ID used for transaction (null for system transactions)',
              example: 1
            },
            transactionType: {
              type: 'string',
              enum: ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER_IN', 'TRANSFER_OUT'],
              description: 'Type of transaction',
              example: 'WITHDRAWAL'
            },
            cardMode: {
              type: 'string',
              enum: ['DEBIT', 'CREDIT'],
              nullable: true,
              description: 'Card mode at time of transaction. DEBIT: balance >= 0. CREDIT: balance >= -creditLimit',
              example: 'DEBIT'
            },
            amount: {
              type: 'number',
              format: 'decimal',
              description: 'Transaction amount (always positive)',
              example: 50.00
            },
            balanceAfter: {
              type: 'number',
              format: 'decimal',
              description: 'Account balance after transaction',
              example: 450.00
            },
            description: {
              type: 'string',
              maxLength: 255,
              nullable: true,
              description: 'Optional transaction description',
              example: 'ATM withdrawal'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when transaction was created'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', 'server.js']
};

module.exports = swaggerJsdoc(options);
