const dotenv = require('dotenv');

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const missingProductionVars = [];

function requiredInProduction(name) {
  const value = process.env[name] || '';
  if (isProduction && !value.trim()) missingProductionVars.push(name);
  return value;
}

const jwtSecret = requiredInProduction('JWT_SECRET') || 'change-me-in-production';
const mongodbUri = requiredInProduction('MONGODB_URI');

if (isProduction && jwtSecret === 'change-me-in-production') {
  missingProductionVars.push('JWT_SECRET (must not use the development default)');
}

if (missingProductionVars.length) {
  throw new Error(`Configuration production invalide: ${missingProductionVars.join(', ')} ${missingProductionVars.length > 1 ? 'sont obligatoires' : 'est obligatoire'}.`);
}

const env = {
  port: process.env.PORT || 5000,
  nodeEnv,
  mongodbUri,
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminEmails: (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
};

module.exports = env;
