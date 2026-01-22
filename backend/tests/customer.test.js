const { describe, it, before } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const app = require('../server.js');

describe('Customer API - Read Operations', () => {
  let testCustomerId;

  before(async () => {
    // Get a customer ID from seeded data
    const response = await request(app).get('/api/customers');
    if (response.body.data && response.body.data.length > 0) {
      testCustomerId = response.body.data[0].id;
    }
  });

  describe('GET /api/customers', () => {
    it('should return all customers', async () => {
      const response = await request(app)
        .get('/api/customers')
        .expect('Content-Type', /json/)
        .expect(200);

      assert.ok(response.body.success);
      assert.ok(Array.isArray(response.body.data));
      assert.ok(response.body.count >= 0);
    });
  });

  describe('GET /api/customers/:id', () => {
    it('should return a specific customer', async () => {
      // Skip if no customer ID available
      if (!testCustomerId) {
        console.log('Skipping: No customers in database');
        return;
      }

      const response = await request(app)
        .get(`/api/customers/${testCustomerId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      assert.ok(response.body.success);
      assert.strictEqual(response.body.data.id, testCustomerId);
      assert.ok(response.body.data.firstName);
      assert.ok(response.body.data.lastName);
      assert.ok(response.body.data.address);
    });

    it('should return 404 for non-existent customer', async () => {
      const response = await request(app)
        .get('/api/customers/99999')
        .expect('Content-Type', /json/)
        .expect(404);

      assert.strictEqual(response.body.success, false);
      assert.ok(response.body.message.includes('not found'));
    });
  });
});
