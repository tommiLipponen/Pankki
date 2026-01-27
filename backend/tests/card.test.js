const {describe, it, before} = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const app = require('../server.js');
const { getAuthToken } = require('./helpers/auth.helper');

describe('Card API - Read Operations', () => {
  let testCardId;
  let authToken;

    before(async () => {
    // Get JWT token for authentication
    authToken = await getAuthToken(app);
    
    // Get a card ID from seeded data
    const response = await request(app)
      .get('/api/cards')
      .set('Authorization', `Bearer ${authToken}`);
    if (response.body.data && response.body.data.length > 0) {
      testCardId = response.body.data[0].id;
    }
  });

  describe('GET /api/cards', () => {
    it('should return all cards', async () => {
      const response = await request(app)
        .get('/api/cards')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

        assert.ok(response.body.success);
        assert.ok(Array.isArray(response.body.data));
        assert.ok(response.body.count >= 0);
    });
  });

  describe('GET /api/cards/:id', () => {
    it('should return a specific card', async () => {
      // Skip if no card ID available
      if (!testCardId) {
        console.log('Skipping: No cards in database');
        return;
      }

        const response = await request(app)
        .get(`/api/cards/${testCardId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

        assert.ok(response.body.success);
        assert.strictEqual(response.body.data.id, testCardId);
        assert.ok(response.body.data.cardNumber);
        assert.ok(response.body.data.expiryDate);
    });

    it('should return 404 for non-existent card', async () => {
      const response = await request(app)
        .get('/api/cards/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(404);

        assert.strictEqual(response.body.success, false);
        assert.ok(response.body.message.includes('not found'));
    });
  });
} );