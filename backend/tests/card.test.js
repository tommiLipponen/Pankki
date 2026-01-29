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


} );