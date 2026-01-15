// Card Controller
// Http requests handling for card operations

const cardService = require('../services/cardService');

class CardController { 
    // GET /api/cards
    async getAllCards(req, res, next) {
        try {
            const cards = await cardService.getAllCards();
            res.json({
                success: true,
                data: cards,
                count: cards.length
            });
        } catch (error) {
            next(error);
        }
            }

    // GET /api/cards/:id
    async getCardById(req, res, next) {
        try {
            const card = await cardService.getCardById(req.params.id);
            if (!card) {
                return res.status(404).json({
                    success: false,
                    message: "Card not found"
                });
            }
            res.json({
                success: true,
                data: card
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/cards
    async createCard(req, res, next) {
        try {
            const { cardNumber, pinHash, customerId, accountId, expiryDate, isLocked, isActive } = req.body;

            // Basic validation
            if (!cardNumber || !pinHash || !expiryDate || !customerId || !accountId) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields: cardNumber, pinHash, expiryDate, customerId, accountId"
                });
            } 
            const card = await cardService.createCard(req.body);

            res.status(201).json({
                success: true,
                data: card,
                message: "Card created successfully"
            });
        } catch (error) {
            if (error.code === 'P2002') {
                return res.status(409).json({
                    success: false,
                    message: "Card with this cardNumber already exists"
                });
            }
            next(error);
        }
    }

    // PUT /api/cards/:id
    async updateCard(req, res, next) {
        try {
            const { cardNumber, pinHash, expiryDate, isLocked, isActive } = req.body;