process.env.NODE_ENV = 'test';

const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

test('GET /api/health returns an ok status', async () => {
  const res = await request(app).get('/api/health').expect(200);
  assert.equal(res.body.service, 'DEL-api');
  assert.ok(res.body.status === 'ok' || res.body.success === true);
});
