const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../config/database");

class AuthService {
    /** 
    * @param {String} cardNumber
    * @returns {Object}
    * @throws {Error}
    */

    async insertCard(cardNumber) {
            const existingCard = await prisma.card.findFirst({
                where: {cardNumber},
                include: {
                    account: true,
                    customer: true
                }
            });

            // Validate if card exists
            if (!existingCard) {
                throw new Error("Card not found");
            }

            // Check if card is active
            if (!existingCard.isActive) {
                throw new Error("Card is inactive");
            }

            // Check if card is expired
            if (new Date() > existingCard.expiryDate) {
                throw new Error("Card is expired");
            }

            // Determine available card mode based on credit limit
            const hashCredit = existingCard.account.creditLimit && existingCard.account.creditLimit > 0;
            const availableCardMode = hashCredit ? ["DEBIT", "CREDIT"] : ["DEBIT"];

            return {
                availableCardMode,
                hashCredit,
                cardId: existingCard.id,
            };
        }
    /**
     *  @param {string} cardNumber
     *  @param {string} pin
     *  @param {string} cardMode
     *  @returns {Object}
     *  @throws {Error}
     */



    async verifyPinAndGenerateToken(cardNumber, pin, cardMode) {
        const card = await prisma.card.findFirst({
            where: { cardNumber },
            include: {
                account: true,
                customer: true
            }
        });

        // Validate if card exists
        if (!card) {
            throw new Error("Card not found");
        }

        // verify PIN using bcrypt
        const isPinValid = await bcrypt.compare(pin, card.hashedPin);

        if (!isPinValid) {
            throw new Error("Invalid PIN");
        }

        // validate card mode (ensure credit mode is availble if selected)

        if (cardMode === "CREDIT" && (!card.account.creditLimit || card.account.creditLimit <= 0)) {
            throw new Error("CREDIT mode is not available for this card");
        }

        // Generate JWT token with user context
        const tokenPayload = {
            cardId: card.id,
            accountId: card.account.id,
            customerId: card.customer.id,
            cardMode: cardMode
        };

        const token = jwt.sign(
            Payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '60d' }
        );

        // Return token and user information
        return {
            token,
            expiresIn: process.env.JWT_EXPIRES_IN || '60d',
            customer: {
                id: card.customer.id,
                firstName: card.customer.firstName,
                lastName: card.customer.lastName
            },

            account: {
                id: card.account.id,
                accountNumber: card.account.accountNumber,
                balance: parseFloat(card.account.balance),
                creditLimit: card.account.creditLimit ? parseFloat(card.account.creditLimit) : null
            }
        };
    }}

        module.exports = new AuthService();


