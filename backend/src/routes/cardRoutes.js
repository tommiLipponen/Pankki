// Card Routes
// API endpoints for card operations

const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

/**
 * @swagger
 * /api/cards:
 *  get:
 *   summary: Retrieve a list of cards
 *   tags: [Cards]
 *   responses:
 *     200:
 *       description: A list of cards
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *             success:
 *              type: boolean
 *              example: true
 *             data:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Card'
 *            count:
 *             type: integer
 *             example: 5
 *     500:
 *       description: Server error
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', cardController.getAllCards.bind(cardController));

/**
 * @swagger
 * /api/cards/{id}:
 *   get:
 *     summary: Retrieve a specific card by its ID
 *     tags: [Cards]
 *     description: Retrieve a specific card by its ID
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
 *                 example: true
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
 *                 example: false
 *                 message:
 *                   type: string
 *                 example: Card not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', cardController.getCardById.bind(cardController));

/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Create a new card
 *     tags: [Cards]
 *     description: Create a new card with the provided details
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
 *                 example: "1111111111111111"
 *                 description: 16-digit card number(UNIQUE)
 *               pinHash:
 *                 type: string
 *                 example: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lui/9p2uJ8k7G2a"
 *                 description: Bcrypt hashed PIN code
 *               customerId:
 *                 type: integer
 *                 example: 1
 *                 description: ID of the customer owning the card
 *               accountId:
 *                 type: integer
 *                 example: 1
 *                 description: ID of the account associated with the card
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31"
 *                 description: Expiry date of the card
 *               isLocked:
 *                 type: boolean
 *                 example: false
 *                 description: Lock status of the card(default: false)
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 description: Activation status of the card(default: true)
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
 *         description: Invalid input - missing required fields
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
 *                   example: Missing required fields
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
 *                   example: Card number already exists
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 */
router.post('/', cardController.createCard.bind(cardController));

/**
 * @swagger
 * /api/cards/{id}:
 *   put:
 *     summary: Update a card
 *     description: Update an existing card's information
 *     tags: [Cards]
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
 *                 example: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lui/9p2uJ8k7G2a"
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
 *                 description: Lock card (after wrong PIN attempts)
 *               isActive:
 *                 type: boolean
 *                 example: false
 *                 description: Deactivate card (lost/stolen)
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
 *     tags: [Cards]
 *     description: Delete a card from the database(cascade deletes related transactions)
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
 *                 example: true
 *                 message:
 *                   type: string
 *                 example: Card deleted successfully
 *       404:
 *         description: Card not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 example: false
 *                 message:
 *                   type: string
 *                 example: Card not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', cardController.deleteCard.bind(cardController));

module.exports = router;

// End of Card Routes