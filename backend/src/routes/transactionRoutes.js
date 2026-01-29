// Transaction Routes
// Defines all REST API endpoints for transaction operations

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management endpoints with DEBIT/CREDIT card mode support
 */

/**
 * @swagger
 * /api/transactions/account/{accountId}:
 *   get:
 *     summary: Get all transactions for a specific account
 *     description: Retrieve transaction history for an account with optional limit. Supports DEBIT (balance >= 0) and CREDIT (balance >= -creditLimit) modes.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of transactions to return
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 count:
 *                   type: integer
 *                   example: 25
 *       400:
 *         description: Invalid accountId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid accountId"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.get('/account/:accountId', transactionController.getTransactionsByAccount.bind(transactionController));

/**
 * @swagger
 * /api/transactions/card/{cardId}:
 *   get:
 *     summary: Get all transactions for a specific card
 *     description: Retrieve transaction history for a card with optional limit
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Card ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of transactions to return
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 count:
 *                   type: integer
 *                   example: 15
 *       400:
 *         description: Invalid cardId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid cardId"
 *       500:
 *         description: Server error
 */
router.get('/card/:cardId', transactionController.getTransactionsByCard.bind(transactionController));

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a specific transaction by ID
 *     description: Retrieve details of a single transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Transaction not found"
 *       500:
 *         description: Server error
 */
router.get('/:id', transactionController.getTransactionById.bind(transactionController));

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     description: Create a new transaction (DEPOSIT, WITHDRAWAL, TRANSFER_IN, TRANSFER_OUT). DEBIT mode requires balance >= 0. CREDIT mode allows balance >= -creditLimit.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountId
 *               - cardId
 *               - transactionType
 *               - cardMode
 *               - amount
 *             properties:
 *               accountId:
 *                 type: integer
 *                 example: 1
 *                 description: Account ID
 *               cardId:
 *                 type: integer
 *                 example: 1
 *                 description: Card ID used for transaction
 *               transactionType:
 *                 type: string
 *                 enum: [DEPOSIT, WITHDRAWAL, TRANSFER_IN, TRANSFER_OUT]
 *                 example: "WITHDRAWAL"
 *                 description: Type of transaction
 *               cardMode:
 *                 type: string
 *                 enum: [DEBIT, CREDIT]
 *                 example: "DEBIT"
 *                 description: "DEBIT: balance must stay >= 0. CREDIT: balance can go to -creditLimit"
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 example: 50.00
 *                 description: Transaction amount (positive number)
 *               description:
 *                 type: string
 *                 maxLength: 255
 *                 example: "ATM withdrawal"
 *                 description: Optional transaction description
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *                 message:
 *                   type: string
 *                   example: "Transaction created successfully"
 *       400:
 *         description: Validation error or business logic error (insufficient funds, locked card, invalid mode, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Insufficient funds for DEBIT transaction"
 *       500:
 *         description: Server error
 */
router.post('/', transactionController.createTransaction.bind(transactionController));

/**
 * @swagger
 * /api/transactions/transfer:
 *   post:
 *     summary: Transfer funds between accounts
 *     description: Transfer funds from one account to another. Creates two transactions (TRANSFER_OUT and TRANSFER_IN). Validates card belongs to source account and respects DEBIT/CREDIT mode rules.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromAccountId
 *               - toAccountId
 *               - cardId
 *               - cardMode
 *               - amount
 *             properties:
 *               fromAccountId:
 *                 type: integer
 *                 example: 1
 *                 description: Source account ID (funds withdrawn from)
 *               toAccountId:
 *                 type: integer
 *                 example: 2
 *                 description: Destination account ID (funds deposited to)
 *               cardId:
 *                 type: integer
 *                 example: 1
 *                 description: Card ID used for transfer (must belong to source account)
 *               cardMode:
 *                 type: string
 *                 enum: [DEBIT, CREDIT]
 *                 example: "DEBIT"
 *                 description: "DEBIT: balance must stay >= 0. CREDIT: balance can go to -creditLimit"
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 example: 100.00
 *                 description: Transfer amount (positive number)
 *               description:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Transfer to savings account"
 *                 description: Optional transfer description
 *     responses:
 *       201:
 *         description: Transfer completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     transferOut:
 *                       $ref: '#/components/schemas/Transaction'
 *                     transferIn:
 *                       $ref: '#/components/schemas/Transaction'
 *                 message:
 *                   type: string
 *                   example: "Transfer completed successfully"
 *       400:
 *         description: Validation error or business logic error (cannot transfer to same account, insufficient funds, locked card, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Cannot transfer to the same account"
 *       500:
 *         description: Server error
 */
router.post('/transfer', transactionController.transfer.bind(transactionController));

module.exports = router;
