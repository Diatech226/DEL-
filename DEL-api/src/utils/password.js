const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { promisify } = require('util');

const scrypt = promisify(crypto.scrypt);
const KEY_LENGTH = 64;
const BCRYPT_ROUNDS = 12;

async function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

async function verifyLegacyScryptPassword(password, storedHash) {
  const [, salt, key] = storedHash.split(':');
  if (!salt || !key) return false;

  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  const storedKey = Buffer.from(key, 'hex');

  return storedKey.length === derivedKey.length && crypto.timingSafeEqual(storedKey, derivedKey);
}

async function verifyPassword(password, storedHash) {
  if (!storedHash) return false;

  if (storedHash.startsWith('scrypt:')) {
    return verifyLegacyScryptPassword(password, storedHash);
  }

  return bcrypt.compare(password, storedHash);
}

module.exports = { hashPassword, verifyPassword };
