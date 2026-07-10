process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/del-test';
process.env.JWT_SECRET = 'test-secret';
process.env.ADMIN_EMAIL = 'ADMIN@Example.TEST';
process.env.ADMIN_PASSWORD = 'StrongAdmin1!';
process.env.ADMIN_FULL_NAME = 'Admin Test';
process.env.ADMIN_FORCE_PASSWORD_UPDATE = 'true';

const test = require('node:test');
const assert = require('node:assert/strict');
const { validateAdminEnv, updateAdminFromEnv } = require('../src/services/adminAccount.service');

test('validateAdminEnv normalizes admin email and validates password policy', () => {
  const config = validateAdminEnv();
  assert.equal(config.email, 'admin@example.test');
  assert.equal(config.mustChangePassword, true);
});

test('updateAdminFromEnv does not replace existing passwordHash without explicit reset', async () => {
  const user = { passwordHash: 'existing-hash', save: async function save() { return this; } };
  const updated = await updateAdminFromEnv(user, { config: validateAdminEnv(), resetPassword: false });
  assert.equal(updated.role, 'ADMIN');
  assert.equal(updated.status, 'ACTIVE');
  assert.equal(updated.passwordHash, 'existing-hash');
});
