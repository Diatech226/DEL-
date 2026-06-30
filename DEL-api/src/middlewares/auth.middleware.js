const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

const unauthorized = (res) => res.status(401).json({ success: false, message: 'Non autorisé' });
const forbidden = (res) => res.status(403).json({ success: false, message: 'Non autorisé' });

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) return unauthorized(res);
    const payload = verifyToken(token);
    const user = await User.findById(payload.userId);
    if (!user || user.status === 'SUSPENDED') return unauthorized(res);
    req.user = user;
    return next();
  } catch (error) {
    return unauthorized(res);
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
      const payload = verifyToken(token);
      const user = await User.findById(payload.userId);
      if (user && user.status !== 'SUSPENDED') req.user = user;
    }
  } catch (error) {
    // Token optionnel invalide : on continue en mode public.
  }
  return next();
}

module.exports = { requireAuth, optionalAuth, requireRole, requireAdmin };
