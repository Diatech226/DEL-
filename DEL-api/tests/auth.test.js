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


test('POST /api/auth/register refuses public ADMIN creation', async () => {
  const res = await request(app).post('/api/auth/register').send({
    fullName: 'Admin Test',
    email: 'admin@example.test',
    password: 'StrongPass1!',
    role: 'ADMIN',
  }).expect(403);
  assert.equal(res.body.success, false);
  assert.equal(res.body.message, 'La création d’un administrateur n’est pas autorisée depuis l’inscription publique.');
});
