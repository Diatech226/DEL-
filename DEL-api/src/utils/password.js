const crypto = require('crypto');
const { promisify } = require('util');

const scrypt = promisify(crypto.scrypt);
const KEY_LENGTH = 64;

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.startsWith('scrypt:')) return false;

  const [, salt, key] = storedHash.split(':');
  if (!salt || !key) return false;

  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  const storedKey = Buffer.from(key, 'hex');

  return storedKey.length === derivedKey.length && crypto.timingSafeEqual(storedKey, derivedKey);
}

module.exports = { hashPassword, verifyPassword };
