const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

// Import the Express app (we'll need to export it from server.js)
const app = require('../server.js');

describe('Health Check API', () => {
  it('should return OK status', async () => {
    const response = await request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200);
    
    assert.strictEqual(response.body.status, 'OK');
    assert.ok(response.body.timestamp);
  });
});
