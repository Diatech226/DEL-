const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');

const PUBLIC_ROLES = ['OWNER', 'COMPANY', 'INVESTOR', 'TECHNICIAN'];
const pick = (obj, keys) => keys.reduce((acc, key) => (obj[key] !== undefined ? { ...acc, [key]: obj[key] } : acc), {});
const sendAuth = (res, user) => res.json({ success: true, data: { user: user.toJSON(), token: signToken(user) } });

async function register(req, res) {
  const { fullName, email, phone, password, role, accountType, country, city } = req.body;
  if (!fullName || !password || password.length < 6 || !role || (!email && !phone)) return res.status(400).json({ success: false, message: 'Données d’inscription invalides' });
  if (!PUBLIC_ROLES.includes(role)) return res.status(403).json({ success: false, message: 'Non autorisé' });
  const or = [];
  if (email) or.push({ email: String(email).toLowerCase().trim() });
  if (phone) or.push({ phone: String(phone).trim() });
  if (or.length && await User.findOne({ $or: or })) return res.status(409).json({ success: false, message: 'Email ou téléphone déjà utilisé' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ fullName, email, phone, passwordHash, role, accountType, country, city, status: 'PENDING' });
  return sendAuth(res, user);
}

async function login(req, res) {
  const { identifier, password } = req.body;
  if (!identifier || !password) return res.status(400).json({ success: false, message: 'Identifiant et mot de passe requis' });
  const ident = String(identifier).trim();
  const user = await User.findOne({ $or: [{ email: ident.toLowerCase() }, { phone: ident }] }).select('+passwordHash');
  if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ success: false, message: 'Non autorisé' });
  if (user.status === 'SUSPENDED') return res.status(401).json({ success: false, message: 'Non autorisé' });
  user.lastLoginAt = new Date();
  await user.save();
  return sendAuth(res, user);
}

const getMe = (req, res) => res.json({ success: true, data: { user: req.user.toJSON() } });
async function updateMe(req, res) {
  Object.assign(req.user, pick(req.body, ['fullName', 'phone', 'country', 'city', 'address', 'avatarUrl', 'preferredLanguage']));
  await req.user.save();
  return res.json({ success: true, data: { user: req.user.toJSON() } });
}
const logoutPlaceholder = (_req, res) => res.json({ success: true, message: 'Déconnexion côté client' });
module.exports = { register, login, getMe, updateMe, logoutPlaceholder };
