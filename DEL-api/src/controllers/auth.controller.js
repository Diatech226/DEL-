const { hashPassword, verifyPassword } = require('../utils/password');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { createAuditLog } = require('../utils/audit');
const { validatePasswordStrength } = require('../utils/passwordPolicy');
const { sanitizeUser } = require('../utils/sanitizeUser');

function logAdminLoginDiagnostic(info) {
  if (process.env.NODE_ENV === 'production') return;
  console.info('[auth:admin]', {
    'Admin trouvé': info.found ? 'oui' : 'non',
    'Rôle': info.role || 'autre',
    'Statut': info.status || 'autre',
    'passwordHash présent': info.hasPasswordHash ? 'oui' : 'non',
    'Comparaison mot de passe': info.passwordMatch === undefined ? 'non testée' : (info.passwordMatch ? 'succès' : 'échec'),
    'JWT généré': info.jwtGenerated ? 'oui' : 'non',
  });
}

const PUBLIC_ROLES = ['OWNER', 'COMPANY', 'TECHNICIAN', 'USER'];
const FORBIDDEN_PUBLIC_ROLES = ['ADMIN', 'SUPER_ADMIN', 'SYSTEM'];
const BLOCKED_STATUSES = ['SUSPENDED', 'REJECTED', 'ARCHIVED'];
const pick = (obj, keys) => keys.reduce((acc, key) => (obj[key] !== undefined ? { ...acc, [key]: obj[key] } : acc), {});
const sendAuth = (res, user) => res.json({ success: true, data: { token: signToken(user), user: sanitizeUser(user) } });

async function register(req, res) {
  const { fullName, email, phone, password, role, accountType, country, city } = req.body;
  const normalizedRole = String(role || '').toUpperCase();
  if (FORBIDDEN_PUBLIC_ROLES.includes(normalizedRole)) return res.status(403).json({ success: false, message: 'La création d’un administrateur n’est pas autorisée depuis l’inscription publique.' });
  const passwordCheck = validatePasswordStrength(password);
  if (!fullName || !passwordCheck.valid || !normalizedRole || (!email && !phone)) return res.status(400).json({ success: false, message: passwordCheck.valid ? 'Données d’inscription invalides' : passwordCheck.message });
  if (!PUBLIC_ROLES.includes(normalizedRole)) return res.status(403).json({ success: false, message: 'Non autorisé' });
  const or = [];
  if (email) or.push({ email: String(email).toLowerCase().trim() });
  if (phone) or.push({ phone: String(phone).trim() });
  if (or.length && await User.findOne({ $or: or })) return res.status(409).json({ success: false, message: 'Email ou téléphone déjà utilisé' });
  const passwordHash = await hashPassword(password);
  const user = await User.create({ fullName, email, phone, passwordHash, role: normalizedRole, accountType, country, city, status: 'PENDING' });
  await createAuditLog({ req, actorUserId: user._id, actorName: user.fullName, actorRole: user.role, action: 'REGISTER', module: 'AUTH', entityType: 'USER', entityId: user._id, entityLabel: user.fullName, message: 'Nouvel utilisateur inscrit' });
  return sendAuth(res, user);
}

async function login(req, res) {
  const { identifier, email, password } = req.body;
  const loginId = identifier || email;
  if (!loginId || !password) return res.status(400).json({ success: false, message: 'Identifiant et mot de passe requis' });
  const ident = String(loginId).trim();
  const user = await User.findOne({ $or: [{ email: ident.toLowerCase() }, { phone: ident }] }).select('+passwordHash');
  const isAdminAttempt = ident.toLowerCase() === String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  let passwordMatch = false;
  if (user?.passwordHash) passwordMatch = await verifyPassword(password, user.passwordHash);
  if (isAdminAttempt) logAdminLoginDiagnostic({ found: Boolean(user), role: user?.role, status: user?.status, hasPasswordHash: Boolean(user?.passwordHash), passwordMatch, jwtGenerated: false });
  if (!user || !user.passwordHash || !passwordMatch) return res.status(401).json({ success: false, message: 'Non autorisé' });
  if (user.status !== 'ACTIVE' || BLOCKED_STATUSES.includes(user.status)) return res.status(401).json({ success: false, message: 'Non autorisé' });
  user.lastLoginAt = new Date();
  await user.save();
  await createAuditLog({ req, actorUserId: user._id, actorName: user.fullName, actorRole: user.role, action: 'LOGIN', module: 'AUTH', entityType: 'USER', entityId: user._id, entityLabel: user.fullName, message: 'Connexion utilisateur' });
  if (isAdminAttempt) logAdminLoginDiagnostic({ found: true, role: user.role, status: user.status, hasPasswordHash: true, passwordMatch: true, jwtGenerated: true });
  return sendAuth(res, user);
}

const clerkSync = (req, res) => res.json({ success: true, data: { user: sanitizeUser(req.user) } });
const clerkMe = (req, res) => res.json({ success: true, data: { user: sanitizeUser(req.user) } });

const getMe = (req, res) => res.json({ success: true, data: { user: sanitizeUser(req.user) } });
async function updateMe(req, res) {
  Object.assign(req.user, pick(req.body, ['fullName', 'phone', 'country', 'city', 'address', 'avatarUrl', 'preferredLanguage']));
  await req.user.save();
  return res.json({ success: true, data: { user: sanitizeUser(req.user) } });
}
async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+passwordHash');
  if (!user || !(await verifyPassword(currentPassword || '', user.passwordHash))) return res.status(401).json({ success: false, message: 'Mot de passe actuel invalide' });
  const passwordCheck = validatePasswordStrength(newPassword);
  if (!passwordCheck.valid) return res.status(400).json({ success: false, message: passwordCheck.message });
  user.passwordHash = await hashPassword(newPassword);
  user.mustChangePassword = false;
  await user.save();
  return res.json({ success: true, data: { user: sanitizeUser(user) }, message: 'Mot de passe mis à jour. Les jetons existants restent valides jusqu’à expiration.' });
}
const logoutPlaceholder = async (req, res) => { await createAuditLog({ req, action: 'LOGOUT', module: 'AUTH', entityType: 'USER', entityId: req.user?._id, entityLabel: req.user?.fullName, message: 'Déconnexion utilisateur' }); return res.json({ success: true, message: 'Déconnexion côté client' }); };
module.exports = { register, login, clerkSync, clerkMe, getMe, updateMe, changePassword, logoutPlaceholder };
