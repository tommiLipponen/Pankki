// Authentication Routes
// API endpoints for authentication operations
// Implements 2-step Finnish ATM authentication flow

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: ATM authentication endpoints (2-step flow)
 */

/**
 * @swagger
 * /api/auth/insert-card:
 *   post:
 *     summary: Step 1 - Insert card and get available modes
 *     tags: [Authentication]
 *     description: Validates card exists, is active, and not expired. Returns available card modes (DEBIT, CREDIT).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardNumber
 *             properties:
 *               cardNumber:
 *                 type: string
 *                 pattern: '^\d{16}$'
 *                 example: "1111222233334444"
 *                 description: 16-digit card number
 *     responses:
 *       200:
 *         description: Card validated successfully
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
 *                     availableCardMode:
 *                       type: array
 *                       items:
 *                         type: string
 *                         enum: [DEBIT, CREDIT]
 *                       example: ["DEBIT", "CREDIT"]
 *                     hasCredit:
 *                       type: boolean
 *                       example: true
 *                     cardId:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Invalid card number format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Card not found, inactive, or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/insert-card', authController.insertCard.bind(authController));

/**
 * @swagger
 * /api/auth/verify-pin:
 *   post:
 *     summary: Step 2 - Verify PIN and get JWT token
 *     tags: [Authentication]
 *     description: Verifies PIN with bcrypt, generates JWT token for authenticated session. Token expires in 60 days (development mode).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardNumber
 *               - pin
 *               - cardMode
 *             properties:
 *               cardNumber:
 *                 type: string
 *                 pattern: '^\d{16}$'
 *                 example: "1111222233334444"
 *                 description: 16-digit card number
 *               pin:
 *                 type: string
 *                 pattern: '^\d{4}$'
 *                 example: "1234"
 *                 description: 4-digit PIN
 *               cardMode:
 *                 type: string
 *                 enum: [DEBIT, CREDIT]
 *                 example: "DEBIT"
 *                 description: Selected card mode (must be available from insert-card response)
 *     responses:
 *       200:
 *         description: Authentication successful, JWT token generated
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
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                       description: JWT token for Authorization header (Bearer token)
 *                     expiresIn:
 *                       type: string
 *                       example: "60d"
 *                       description: Token expiration time
 *                     customer:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         firstName:
 *                           type: string
 *                           example: "Matti"
 *                         lastName:
 *                           type: string
 *                           example: "Meikäläinen"
 *                     account:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         accountNumber:
 *                           type: string
 *                           example: "FI1234567890123456"
 *                         balance:
 *                           type: number
 *                           format: float
 *                           example: 1000.00
 *                         creditLimit:
 *                           type: number
 *                           format: float
 *                           nullable: true
 *                           example: 500.00
 *       400:
 *         description: Invalid request format or CREDIT mode not available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid card number or PIN
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/verify-pin', authController.verifyPin.bind(authController));

module.exports = router;
