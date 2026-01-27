// Authentication Helper for Tests
// Provides JWT token for testing protected endpoints

const request = require('supertest');

/**
 * Authenticate and get JWT token for testing
 * 
 * Uses first active card with PIN 1234 (from seed.js)
 * Card: 1234567890123456 (Matti's card)
 * 
 * @param {Express.Application} app - Express app instance
 * @returns {Promise<string>} JWT token
 */
async function getAuthToken(app) {
  // Use known test card and PIN from seed.js
  const testCardNumber = '1234567890123456'; // Matti's card
  const testPin = '1234';
  
  // Step 1: Insert card
  const insertResponse = await request(app)
    .post('/api/auth/insert-card')
    .send({ cardNumber: testCardNumber });
  
  if (!insertResponse.body.success) {
    throw new Error(`Insert card failed: ${insertResponse.body.message}`);
  }
  
  // Step 2: Verify PIN and get token
  const authResponse = await request(app)
    .post('/api/auth/verify-pin')
    .send({
      cardNumber: testCardNumber,
      pin: testPin,
      cardMode: 'DEBIT'
    });
  
  if (!authResponse.body.success || !authResponse.body.data.token) {
    throw new Error(`Authentication failed: ${authResponse.body.message || 'No token returned'}`);
  }
  
  return authResponse.body.data.token;
}

module.exports = { getAuthToken };
