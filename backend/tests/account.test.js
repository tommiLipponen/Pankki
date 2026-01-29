const { describe, it, before } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const app = require('../server.js');
const { getAuthToken } = require('./helpers/auth.helper');

describe('Account API - Read Operations', () => {
  let testAccountId;
  let authToken;

  before(async () => {
    // Get JWT token for authentication
    authToken = await getAuthToken(app);
    
    // Get a account ID from seeded data
    const response = await request(app)
      .get('/api/accounts')
      .set('Authorization', `Bearer ${authToken}`);
    if (response.body.data && response.body.data.length > 0) {
      testAccountId = response.body.data[0].id;
    }
  });

  describe('GET /api/accounts', () => {
    it('should return all accounts', async () => {
      const response = await request(app)
        .get('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      assert.ok(response.body.success);
      assert.ok(Array.isArray(response.body.data));
      assert.ok(response.body.count >= 0);
    });
  });


});