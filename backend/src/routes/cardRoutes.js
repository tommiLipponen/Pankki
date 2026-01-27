// Card Routes
// API endpoints for card management

const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: Card management endpoints
 */

/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: Get all cards
 *     description: Retrieve a list of all cards in the system
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cards retrieved successfully
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
 *                     $ref: '#/components/schemas/Card'
 *                 count:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Internal server error
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
 *                   example: Internal server error
 */
router.get('/', cardController.getAllCards.bind(cardController));

/**
 * @swagger
 * /api/cards/{id}:
 *   get:
 *     summary: Get card by ID
 *     description: Retrieve a specific card by its ID
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Card ID
 *     responses:
 *       200:
 *         description: Card retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Card'
 *       404:
 *         description: Card not found
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
 *                   example: Card not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', cardController.getCardById.bind(cardController));

/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Create a new card
 *     description: Create a new card in the system
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardNumber
 *               - pinHash
 *               - customerId
 *               - accountId
 *               - expiryDate
 *             properties:
 *               cardNumber:
 *                 type: string
 *                 minLength: 16
 *                 maxLength: 16
 *                 example: "1234567890123456"
 *                 description: 16-digit card number (unique)
 *               pinHash:
 *                 type: string
 *                 example: "$2b$10$abcd..."
 *                 description: Hashed PIN for security
 *               customerId:
 *                 type: integer
 *                 example: 1
 *                 description: ID of the customer who owns this card
 *               accountId:
 *                 type: integer
 *                 example: 1
 *                 description: ID of the account linked to this card
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2028-12-31T23:59:59.999Z"
 *                 description: Card expiry date
 *               isLocked:
 *                 type: boolean
 *                 example: false
 *                 description: Lock status (default false)
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 description: Active status (default true)
 *     responses:
 *       201:
 *         description: Card created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Card'
 *                 message:
 *                   type: string
 *                   example: Card created successfully
 *       400:
 *         description: Bad request - Missing fields or invalid customerId/accountId
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
 *                   example: Missing required fields or cardNumber must be 16 digits long
 *       409:
 *         description: Card number already exists
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
 *                   example: Card with this cardNumber already exists
 *       500:
 *         description: Internal server error
 */
router.post('/', cardController.createCard.bind(cardController));

/**
 * @swagger
 * /api/cards/{id}:
 *   put:
 *     summary: Update a card
 *     description: Update an existing card's information
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Card ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cardNumber:
 *                 type: string
 *                 minLength: 16
 *                 maxLength: 16
 *                 example: "1234567890123456"
 *               pinHash:
 *                 type: string
 *                 example: "$2b$10$newHash..."
 *               customerId:
 *                 type: integer
 *                 example: 1
 *               accountId:
 *                 type: integer
 *                 example: 2
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2029-12-31T23:59:59.999Z"
 *               isLocked:
 *                 type: boolean
 *                 example: true
 *                 description: Lock card (e.g., after wrong PIN attempts)
 *               isActive:
 *                 type: boolean
 *                 example: false
 *                 description: Deactivate card (e.g., lost/stolen)
 *             description: At least one field must be provided
 *     responses:
 *       200:
 *         description: Card updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Card'
 *                 message:
 *                   type: string
 *                   example: Card updated successfully
 *       400:
 *         description: Bad request - No fields provided or invalid data
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
 *                   example: At least one field must be provided for update
 *       404:
 *         description: Card not found
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
 *                   example: Card not found
 *       409:
 *         description: Card number already exists
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
 *                   example: Card with this cardNumber already exists
 *       500:
 *         description: Internal server error
 */
router.put('/:id', cardController.updateCard.bind(cardController));

/**
 * @swagger
 * /api/cards/{id}:
 *   delete:
 *     summary: Delete a card
 *     description: Delete a card from the system (cascade deletes related transactions)
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Card ID
 *     responses:
 *       200:
 *         description: Card deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Card deleted successfully
 *       404:
 *         description: Card not found
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
 *                   example: Card not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', cardController.deleteCard.bind(cardController));

module.exports = router;
