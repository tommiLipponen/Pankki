const { describe, it, before } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const app = require('../server.js');

describe('Transaction API - Read Operations', () => {
  let testTransactionId;
  let testTransactionAccountId;
  let testTransactionCardId;

    before(async () => {
    // Get first transaction ID from seeded data
    const response = await request(app).get('/api/transactions/1');
    if (response.body.data) {
      testTransactionId = response.body.data.id;
      testTransactionAccountId = response.body.data.accountId;
      testTransactionCardId = response.body.data.cardId;
    }
    });

    describe('GET /api/transactions/:id', () => {
        it('should return transaction by id', async () => {
            const response = await request(app).get(`/api/transactions/${testTransactionId}`);
            assert.strictEqual(response.status, 200);
            assert.ok(response.body.data);
        });

        it('should return 404 for non-existent transaction id', async () => {
            const response = await request(app).get('/api/transactions/99999');
            assert.strictEqual(response.status, 404);
            assert.strictEqual(response.body.success, false);
            assert.ok(response.body.message.includes('not found'));
        });
    });

    describe('GET /api/transactions/account/:accountId', () => {
        it('should return transactions by account id', async () => {
            const response = await request(app).get(`/api/transactions/account/${testTransactionAccountId}`);
            assert.strictEqual(response.status, 200);
            assert.ok(response.body.data);
        });

        it('should return 404 for non-existent account id', async () => {
            const response = await request(app).get('/api/transactions/account/99999');
            assert.strictEqual(response.status, 404);
            assert.strictEqual(response.body.success, false);
            assert.ok(response.body.message.includes('not found'));
        });
    });

    describe('GET /api/transactions/card/:cardId', () => {
        it('should return transactions by card id', async () => {
            const response = await request(app).get(`/api/transactions/card/${testTransactionCardId}`);
            assert.strictEqual(response.status, 200);
            assert.ok(response.body.data);
        });

        it('should return 404 for non-existent card id', async () => {
            const response = await request(app).get('/api/transactions/card/99999');
            assert.strictEqual(response.status, 404);
            assert.strictEqual(response.body.success, false);
            assert.ok(response.body.message.includes('not found'));
        });
    });
});