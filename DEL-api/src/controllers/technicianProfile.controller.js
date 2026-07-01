const TechnicianProfile = require('../models/TechnicianProfile');
const asyncHandler = require('../utils/asyncHandler');
const { auditCreate, auditStatusChange } = require('../utils/audit');
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
exports.createTechnicianProfile = asyncHandler(async (req, res) => {
  if (!req.body.fullName && !req.body.companyName) return bad(res, 'fullName ou companyName est obligatoire');
  if (!req.body.phone) return bad(res, 'phone est obligatoire');
  if (!req.body.country) return bad(res, 'country est obligatoire');
  if (!req.body.city) return bad(res, 'city est obligatoire');
  const item = await TechnicianProfile.create(req.body);
  await auditCreate(req, 'TECHNICIAN', 'TECHNICIAN_PROFILE', item, 'Profil technicien créé'); res.status(201).json({ success: true, data: item });
});
exports.getTechnicianProfiles = asyncHandler(async (_req, res) => { const items = await TechnicianProfile.find().sort({ createdAt: -1 }); res.json({ success: true, count: items.length, data: items }); });
exports.getTechnicianProfileById = asyncHandler(async (req, res) => { const item = await TechnicianProfile.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); res.json({ success: true, data: item }); });
exports.updateTechnicianProfile = asyncHandler(async (req, res) => { const item = await TechnicianProfile.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); res.json({ success: true, data: item }); });
exports.updateTechnicianProfileStatus = asyncHandler(async (req, res) => { const update = statusUpdate(req.body.status, req.body.rejectionReason); if (!update) return bad(res, 'Statut invalide'); const before = await TechnicianProfile.findById(req.params.id); const item = before && await TechnicianProfile.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); await auditStatusChange(req, 'TECHNICIAN', 'TECHNICIAN_PROFILE', item, before?.status, item.status, `Statut profil technicien changé de ${before?.status || '—'} à ${item.status}`); res.json({ success: true, data: item }); });
exports.deleteTechnicianProfile = asyncHandler(async (req, res) => { const item = await TechnicianProfile.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); res.json({ success: true, data: item }); });
