// Card Serivice
// This service handles all operations related to cards in the application.

const prisma = require('../config/database');

class CardService {
  // Get all cards
  async getAllCards() {
    return await prisma.card.findMany({
      orderBy: { id: 'asc' }
    });
  }

    // Get card by ID  
    async getCardById(id) {
    return await prisma.card.findUnique({
      where: { id: parseInt(id) }
    });
  }

    // Create new card 
    async createCard(data) {
    return await prisma.card.create({
      data: { 
        cardNumber: data.cardNumber,
        pinHash: data.pinHash,
        expiryDate: data.expiryDate,
        isActive: data.isActive,
        isLocked: data.isLocked,
        createdAt: new Date(),
        updatedAt: new Date(),

       
      }
    });
    }
    // Update card
    async updateCard(id, data) {
    return await prisma.card.update({
      where: { id: parseInt(id) },
        data: {
        cardNumber: data.cardNumber,
        pinHash: data.pinHash,
        expiryDate: data.expiryDate,
        isActive: data.isActive,
        isLocked: data.isLocked, 
        updatedAt: new Date(),

      
      }
    });
  }
    // Delete card
    async deleteCard(id) {
    return await prisma.card.delete({
      where: { id: parseInt(id) }
    });
  }
}

module.exports = new CardService();