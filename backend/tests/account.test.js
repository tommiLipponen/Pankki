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

  describe('GET /api/accounts/:id', () => {
    it('should return a specific account', async () => {
      // Skip if no account ID available
      if (!testAccountId) {
        console.log('Skipping: No accounts in database');
        return;
      }

      const response = await request(app)
        .get(`/api/accounts/${testAccountId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      assert.ok(response.body.success);
      assert.strictEqual(response.body.data.id, testAccountId);
      assert.ok(response.body.data.accountNumber);
      assert.ok(response.body.data.balance);
      assert.ok(response.body.data.creditLimit);
    });

    it('should return 404 for non-existent account', async () => {
      const response = await request(app)
        .get('/api/accounts/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(404);

      assert.strictEqual(response.body.success, false);
      assert.ok(response.body.message.includes('not found'));
    });
  });
});