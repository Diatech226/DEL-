process.env.NODE_ENV = 'test';

const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

test('POST /api/auth/register without body returns 400', async () => {
  const res = await request(app).post('/api/auth/register').send({}).expect(400);
  assert.equal(res.body.success, false);
  assert.ok(res.body.message);
});

test('POST /api/auth/login without body returns 400', async () => {
  const res = await request(app).post('/api/auth/login').send({}).expect(400);
  assert.equal(res.body.success, false);
  assert.ok(res.body.message);
});
