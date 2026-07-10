const { syncClerkUser } = require('../services/clerkUserSync.service');

const blockedStatuses = ['SUSPENDED', 'REJECTED', 'ARCHIVED'];
const unauthorized = (res) => res.status(401).json({ success: false, message: 'Non autorisé' });
function getBearer(req) { const [scheme, token] = String(req.headers.authorization || '').split(' '); return scheme === 'Bearer' ? token : null; }
function authorizedParties() { return (process.env.CLERK_AUTHORIZED_PARTIES || '').split(',').map((v) => v.trim()).filter(Boolean); }
async function verify(token) {
  if (!process.env.CLERK_SECRET_KEY) throw new Error('CLERK_SECRET_KEY manquante');
  const { verifyToken: verifyClerkToken } = require('@clerk/backend');
  return verifyClerkToken(token, { secretKey: process.env.CLERK_SECRET_KEY, authorizedParties: authorizedParties().length ? authorizedParties() : undefined });
}
async function attach(req, token) {
  const payload = await verify(token);
  const userId = payload.sub || payload.userId;
  if (!userId) throw new Error('Token Clerk sans utilisateur');
  req.clerkAuth = { userId, sessionId: payload.sid || payload.sessionId || null };
  const user = await syncClerkUser(userId);
  if (!user || blockedStatuses.includes(user.status)) throw new Error('Utilisateur DEL indisponible');
  req.user = user;
  req.authType = 'CLERK';
}
async function requireClerkAuth(req, res, next) { try { const token = getBearer(req); if (!token) return unauthorized(res); await attach(req, token); return next(); } catch { return unauthorized(res); } }
async function optionalClerkAuth(req, _res, next) { try { const token = getBearer(req); if (token) await attach(req, token); } catch {} return next(); }
module.exports = { requireClerkAuth, optionalClerkAuth, attachClerkAuth: attach };
