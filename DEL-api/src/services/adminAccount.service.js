const User = require('../models/User');
const { hashPassword } = require('../utils/password');
const { validatePasswordStrength } = require('../utils/passwordPolicy');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const truthy = (value) => ['true', '1', 'yes', 'on'].includes(String(value || '').toLowerCase());
const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

function validateAdminEnv() {
  const email = normalizeEmail(process.env.ADMIN_EMAIL);
  const password = process.env.ADMIN_PASSWORD || '';
  const errors = [];
  if (!process.env.MONGODB_URI) errors.push('MONGODB_URI est obligatoire.');
  if (!process.env.JWT_SECRET) errors.push('JWT_SECRET est obligatoire.');
  if (!emailRegex.test(email)) errors.push('ADMIN_EMAIL doit être une adresse email valide.');
  const passwordCheck = validatePasswordStrength(password);
  if (!passwordCheck.valid) errors.push(passwordCheck.message);
  if (errors.length) {
    const error = new Error(`Configuration admin invalide: ${errors.join(' ')}`);
    error.code = 'ADMIN_ENV_INVALID';
    throw error;
  }
  return {
    email,
    password,
    fullName: String(process.env.ADMIN_FULL_NAME || 'Administrateur DEL').trim(),
    phone: String(process.env.ADMIN_PHONE || '').trim(),
    mustChangePassword: truthy(process.env.ADMIN_FORCE_PASSWORD_UPDATE),
    resetPasswordOnStart: truthy(process.env.ADMIN_RESET_PASSWORD_ON_START),
  };
}

async function createAdminFromEnv(options = {}) {
  const config = options.config || validateAdminEnv();
  const passwordHash = await hashPassword(config.password);
  return User.create({ fullName: config.fullName || 'Administrateur DEL', email: config.email, phone: config.phone || undefined, passwordHash, role: 'ADMIN', status: 'ACTIVE', accountType: 'ADMIN', mustChangePassword: config.mustChangePassword });
}

async function updateAdminFromEnv(user, options = {}) {
  const config = options.config || validateAdminEnv();
  const resetPassword = Boolean(options.resetPassword || config.resetPasswordOnStart);
  user.role = 'ADMIN';
  user.status = 'ACTIVE';
  user.accountType = 'ADMIN';
  if (config.fullName) user.fullName = config.fullName;
  if (config.phone) user.phone = config.phone;
  if (resetPassword) {
    user.passwordHash = await hashPassword(config.password);
    user.mustChangePassword = config.mustChangePassword;
  }
  return user.save();
}

async function ensureAdminAccount(options = {}) {
  const config = validateAdminEnv();
  const resetPassword = Boolean(options.resetPassword || config.resetPasswordOnStart);
  if (resetPassword) console.warn('⚠️ ADMIN_RESET_PASSWORD_ON_START est actif: le hash du mot de passe administrateur va être réinitialisé. Désactivez cette option après usage.');
  const existing = await User.findOne({ email: config.email }).select('+passwordHash');
  if (!existing) {
    const user = await createAdminFromEnv({ config });
    return { user, created: true, passwordReset: true };
  }
  const user = await updateAdminFromEnv(existing, { config, resetPassword });
  return { user, created: false, passwordReset: resetPassword };
}

module.exports = { ensureAdminAccount, createAdminFromEnv, updateAdminFromEnv, validateAdminEnv };
