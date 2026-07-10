const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { auditCreate, auditStatusChange } = require('../utils/audit');
const { hashPassword } = require('../utils/password');
const { validatePasswordStrength } = require('../utils/passwordPolicy');
const { sanitizeUser } = require('../utils/sanitizeUser');
const allowedStatuses = ['ACTIVE', 'PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED', 'ARCHIVED'];
const bad = (res, message) => res.status(400).json({ success: false, message });
function statusUpdate(status, rejectionReason = '') {
  if (!allowedStatuses.includes(status)) return null;
  const update = { status };
  if (status === 'ACTIVE' || status === 'VERIFIED') { update.verifiedAt = new Date(); update.rejectionReason = ''; }
  if (status === 'REJECTED') update.rejectionReason = rejectionReason || 'Profil rejeté';
  if (status === 'PENDING' || status === 'SUSPENDED' || status === 'ARCHIVED') update.verifiedAt = undefined;
  return update;
}
exports.createUser = asyncHandler(async (req, res) => {
  if (!req.body.fullName) return bad(res, 'fullName est obligatoire');
  if (!req.body.role) return bad(res, 'role est obligatoire');
  if (!req.body.phone && !req.body.email) return bad(res, 'phone ou email est obligatoire');
  const item = await User.create(req.body);
  await auditCreate(req, 'USER', 'USER', item, 'Utilisateur créé'); res.status(201).json({ success: true, data: sanitizeUser(item) });
});
exports.createAdmin = asyncHandler(async (req, res) => {
  const { fullName, email, phone, temporaryPassword } = req.body;
  if (!fullName || !email || !temporaryPassword) return bad(res, 'fullName, email et temporaryPassword sont obligatoires');
  const passwordCheck = validatePasswordStrength(temporaryPassword);
  if (!passwordCheck.valid) return bad(res, passwordCheck.message);
  const passwordHash = await hashPassword(temporaryPassword);
  const item = await User.create({ fullName, email, phone, passwordHash, role: 'ADMIN', status: 'ACTIVE', accountType: 'ADMIN', mustChangePassword: true });
  await auditCreate(req, 'USER', 'USER', item, 'Administrateur créé');
  res.status(201).json({ success: true, data: sanitizeUser(item) });
});
exports.getUsers = asyncHandler(async (_req, res) => { const items = await User.find().sort({ createdAt: -1 }); res.json({ success: true, count: items.length, data: items.map(sanitizeUser) }); });
exports.getUserById = asyncHandler(async (req, res) => { const item = await User.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); res.json({ success: true, data: sanitizeUser(item) }); });
exports.updateUser = asyncHandler(async (req, res) => { const body = { ...req.body }; delete body.password; delete body.passwordHash; const item = await User.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); res.json({ success: true, data: sanitizeUser(item) }); });
exports.updateUserStatus = asyncHandler(async (req, res) => { const update = statusUpdate(req.body.status, req.body.rejectionReason); if (!update) return bad(res, 'Statut invalide'); const before = await User.findById(req.params.id); const item = before && await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); await auditStatusChange(req, 'USER', 'USER', item, before?.status, item.status, `Statut utilisateur changé de ${before?.status || '—'} à ${item.status}`); res.json({ success: true, data: sanitizeUser(item) }); });
exports.resetPassword = asyncHandler(async (req, res) => { const { temporaryPassword, mustChangePassword = true } = req.body; const passwordCheck = validatePasswordStrength(temporaryPassword); if (!passwordCheck.valid) return bad(res, passwordCheck.message); const item = await User.findById(req.params.id).select('+passwordHash'); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); item.passwordHash = await hashPassword(temporaryPassword); item.mustChangePassword = Boolean(mustChangePassword); await item.save(); res.json({ success: true, data: sanitizeUser(item) }); });
exports.deleteUser = asyncHandler(async (req, res) => { const item = await User.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); res.json({ success: true, data: sanitizeUser(item) }); });
