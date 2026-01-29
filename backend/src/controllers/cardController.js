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

            // Authorization: User can only view cards belonging to their customer
            if (parseInt(req.user.customerId) !== parseInt(card.customerId)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied: You can only view your own cards"
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
            const { cardNumber, pinHash, customerId, accountId, expiryDate} = req.body;

            // Basic validation
            if (!cardNumber || !pinHash || !expiryDate || !customerId || !accountId) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields: cardNumber, pinHash, expiryDate, customerId, accountId"
                });
            }
            // Validate card number length
            if (cardNumber.length !== 16) {
                return res.status(400).json({
                    success: false,
                    message: "cardNumber must be 16 digits long"
                });
            }
            const card = await cardService.createCard(req.body);

            res.status(201).json({
                success: true,
                data: card,
                message: "Card created successfully"
            });
        } catch (error) {
            // Handle unique constraint violation for cardNumber
            if (error.code === 'P2002') {
                return res.status(409).json({
                    success: false,
                    message: "Card with this cardNumber already exists"
                });
            }
            //Handle foreign key constraint violation for customerId and accountId
            if (error.code === 'P2003') {
                return res.status(400).json({
                    success: false,
                    message: "Invalid customerId or accountId does not exist"
                });
            }
            next(error);
        }
    }

    // PUT /api/cards/:id
    async updateCard(req, res, next) {
        try {
            const { cardNumber, pinHash,customerId,accountId, expiryDate, isLocked, isActive } = req.body;

            // At least one field must be provided for update
            if (!cardNumber && !pinHash && !customerId && !accountId && !expiryDate && isLocked === undefined && isActive === undefined) {
                return res.status(400).json({
                    success: false,
                    message: "At least one field must be provided for update: cardNumber, pinHash, customerId, accountId, expiryDate, isLocked, isActive"
                });
            }

            // First fetch the card to check ownership
            const existingCard = await cardService.getCardById(req.params.id);
            if (!existingCard) {
                return res.status(404).json({
                    success: false,
                    message: "Card not found"
                });
            }

            // Authorization: User can only update cards belonging to their customer
            if (parseInt(req.user.customerId) !== parseInt(existingCard.customerId)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied: You can only update your own cards"
                });
            }

            //Validate card number length if provided
            if (cardNumber && cardNumber.length !== 16) {
                return res.status(400).json({
                    success: false,
                    message: "cardNumber must be 16 digits long"
                });
            }
            const card = await cardService.updateCard(req.params.id, req.body);

            res.json({
                success: true,
                data: card,
                message: "Card updated successfully"
            });
        } catch (error) {
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    message: "Card not found"
                });
            }
            if (error.code === 'P2002') {
                return res.status(409).json({
                    success: false,
                    message: "Card with this cardNumber already exists"
                });

        }
        if (error.code === 'P2003') {
            return res.status(400).json({
                success: false,
                message: "Invalid customerId or accountId does not exist"
            });
        }
        next(error);
    }
            
    }

    // DELETE /api/cards/:id
    async deleteCard(req, res, next) {
        try {
            // First fetch the card to check ownership
            const existingCard = await cardService.getCardById(req.params.id);
            if (!existingCard) {
                return res.status(404).json({
                    success: false,
                    message: "Card not found"
                });
            }

            // Authorization: User can only delete cards belonging to their customer
            if (parseInt(req.user.customerId) !== parseInt(existingCard.customerId)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied: You can only delete your own cards"
                });
            }

            await cardService.deleteCard(req.params.id);
            res.json({
                success: true,
                message: "Card deleted successfully"
            });
        } catch (error) {
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    message: "Card not found"
                });
            }
            next(error);
        }
    }
}
module.exports = new CardController();