const OwnerProfile = require('../models/OwnerProfile');
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
exports.createOwnerProfile = asyncHandler(async (req, res) => {
  if (!req.body.fullName && !req.body.companyName) return bad(res, 'fullName ou companyName est obligatoire');
  if (!req.body.phone) return bad(res, 'phone est obligatoire');
  if (!req.body.country) return bad(res, 'country est obligatoire');
  if (!req.body.city) return bad(res, 'city est obligatoire');
  const item = await OwnerProfile.create(req.body);
  res.status(201).json({ success: true, data: item });
});
exports.getOwnerProfiles = asyncHandler(async (_req, res) => { const items = await OwnerProfile.find().sort({ createdAt: -1 }); res.json({ success: true, count: items.length, data: items }); });
exports.getOwnerProfileById = asyncHandler(async (req, res) => { const item = await OwnerProfile.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); res.json({ success: true, data: item }); });
exports.updateOwnerProfile = asyncHandler(async (req, res) => { const item = await OwnerProfile.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); res.json({ success: true, data: item }); });
exports.updateOwnerProfileStatus = asyncHandler(async (req, res) => { const update = statusUpdate(req.body.status, req.body.rejectionReason); if (!update) return bad(res, 'Statut invalide'); const item = await OwnerProfile.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); res.json({ success: true, data: item }); });
exports.deleteOwnerProfile = asyncHandler(async (req, res) => { const item = await OwnerProfile.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); res.json({ success: true, data: item }); });
