const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');
const { attachClerkAuth } = require('./clerkAuth.middleware');

const unauthorized = (res) => res.status(401).json({ success: false, message: 'Non autorisé' });
const forbidden = (res) => res.status(403).json({ success: false, message: 'Non autorisé' });

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) return unauthorized(res);
    const payload = verifyToken(token);
    const user = await User.findById(payload.userId);
    if (!user || ['SUSPENDED', 'REJECTED', 'ARCHIVED'].includes(user.status)) return unauthorized(res);
    req.user = user;
    req.authType = 'JWT';
    return next();
  } catch (error) {
    return unauthorized(res);
  }
}

async function requireAnyAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return unauthorized(res);
  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.userId);
    if (!user || ['SUSPENDED', 'REJECTED', 'ARCHIVED'].includes(user.status)) return unauthorized(res);
    req.user = user;
    req.authType = 'JWT';
    return next();
  } catch (jwtError) {
    try {
      await attachClerkAuth(req, token);
      return next();
    } catch (clerkError) {
      return unauthorized(res);
    }
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return unauthorized(res);
    if (!roles.includes(req.user.role)) return forbidden(res);
    return next();
  };
}

const requireAdmin = [requireAuth, requireRole('ADMIN')];

async function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme === 'Bearer' && token) {
      try {
        const payload = verifyToken(token);
        const user = await User.findById(payload.userId);
        if (user && !['SUSPENDED', 'REJECTED', 'ARCHIVED'].includes(user.status)) { req.user = user; req.authType = 'JWT'; }
      } catch {
        await attachClerkAuth(req, token);
      }
    }
  } catch (error) {
    // Token optionnel invalide : on continue en mode public.
  }
  return next();
}

module.exports = { requireAuth, requireAnyAuth, optionalAuth, optionalAnyAuth: optionalAuth, requireRole, requireAdmin };
