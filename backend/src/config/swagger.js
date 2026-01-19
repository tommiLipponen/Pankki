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
        name: 'Customers',
        description: 'Customer management endpoints'
      },
      {
        name: 'Accounts',
        description: 'Account management endpoints'
      },
      {
        name: 'Health',
        description: 'System health check'
      }
    ],
    components: {
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
        }
      }
    }
  },

  Transaction: {
    type: 'object',
    required: ['accountId', 'amount', 'type'],
    properties: {
      id: {
        type: 'integer',
        description: 'Auto-generated transaction ID',
        example: 1
      },
      accountId: {
        type: 'integer',
        description: 'Account ID associated with this transaction',
        example: 1
      },
      cardId: {
        type: 'integer',
        description: 'Card ID associated with this transaction (NULL for system transactions)',
        example: 1
      },
      amount: {
        type: 'number',
        format: 'decimal',
        description: 'Transaction amount (positive for credit, negative for debit)',
        example: -50.00
      },
      type: {
        type: 'string',
        enum: ['DEBIT', 'CREDIT'],
        description: 'Transaction type (DEBIT or CREDIT)',
        example: 'DEBIT'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Timestamp when transaction occurred'
      },
      balanceAfter: {
        type: 'number',
        format: 'decimal',
        description: 'Account balance after transaction',
        example: 950.00
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
    }
  },
  apis: ['./src/routes/*.js', 'server.js']
};

module.exports = swaggerJsdoc(options);
