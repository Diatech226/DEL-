const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const allowedStatuses = ['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'];
const bad = (res, message) => res.status(400).json({ success: false, message });
function statusUpdate(status, rejectionReason = '') {
  if (!allowedStatuses.includes(status)) return null;
  const update = { status };
  if (status === 'VERIFIED') { update.verifiedAt = new Date(); update.rejectionReason = ''; }
  if (status === 'REJECTED') update.rejectionReason = rejectionReason || 'Profil rejeté';
  if (status === 'PENDING' || status === 'SUSPENDED') update.verifiedAt = undefined;
  return update;
}
exports.createUser = asyncHandler(async (req, res) => {
  if (!req.body.fullName) return bad(res, 'fullName est obligatoire');
  if (!req.body.role) return bad(res, 'role est obligatoire');
  if (!req.body.phone && !req.body.email) return bad(res, 'phone ou email est obligatoire');
  const item = await User.create(req.body);
  res.status(201).json({ success: true, data: item });
});
exports.getUsers = asyncHandler(async (_req, res) => { const items = await User.find().sort({ createdAt: -1 }); res.json({ success: true, count: items.length, data: items }); });
exports.getUserById = asyncHandler(async (req, res) => { const item = await User.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); res.json({ success: true, data: item }); });
exports.updateUser = asyncHandler(async (req, res) => { const item = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); res.json({ success: true, data: item }); });
exports.updateUserStatus = asyncHandler(async (req, res) => { const update = statusUpdate(req.body.status, req.body.rejectionReason); if (!update) return bad(res, 'Statut invalide'); const item = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); res.json({ success: true, data: item }); });
exports.deleteUser = asyncHandler(async (req, res) => { const item = await User.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); res.json({ success: true, data: item }); });
