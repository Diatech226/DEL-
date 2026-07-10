process.env.NODE_ENV = 'test';

const test = require('node:test');
const assert = require('node:assert/strict');
const { validatePasswordStrength } = require('../src/utils/passwordPolicy');
const { sanitizeUser } = require('../src/utils/sanitizeUser');

test('validatePasswordStrength rejects weak passwords and accepts strong passwords', () => {
  assert.equal(validatePasswordStrength('short').valid, false);
  assert.equal(validatePasswordStrength('LongEnough1!').valid, true);
});

test('sanitizeUser removes secret fields', () => {
  const user = sanitizeUser({ _id: 'abc', email: 'a@b.test', passwordHash: 'hash', resetToken: 'token', resetTokenExpires: new Date(), role: 'ADMIN' });
  assert.equal(user.passwordHash, undefined);
  assert.equal(user.resetToken, undefined);
  assert.equal(user.resetTokenExpires, undefined);
  assert.equal(user.email, 'a@b.test');
});
