const CompanyProfile = require('../models/CompanyProfile');
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
exports.createCompanyProfile = asyncHandler(async (req, res) => {
  for (const f of ['companyName','companyType','contactName','phone','country','city']) if (!req.body[f]) return bad(res, f + ' est obligatoire');
  const item = await CompanyProfile.create(req.body);
  await auditCreate(req, 'COMPANY', 'COMPANY_PROFILE', item, 'Profil entreprise créé'); res.status(201).json({ success: true, data: item });
});
exports.getCompanyProfiles = asyncHandler(async (_req, res) => { const items = await CompanyProfile.find().sort({ createdAt: -1 }); res.json({ success: true, count: items.length, data: items }); });
exports.getCompanyProfileById = asyncHandler(async (req, res) => { const item = await CompanyProfile.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); res.json({ success: true, data: item }); });
exports.updateCompanyProfile = asyncHandler(async (req, res) => { const item = await CompanyProfile.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); res.json({ success: true, data: item }); });
exports.updateCompanyProfileStatus = asyncHandler(async (req, res) => { const update = statusUpdate(req.body.status, req.body.rejectionReason); if (!update) return bad(res, 'Statut invalide'); const before = await CompanyProfile.findById(req.params.id); const item = before && await CompanyProfile.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); await auditStatusChange(req, 'COMPANY', 'COMPANY_PROFILE', item, before?.status, item.status, `Statut profil entreprise changé de ${before?.status || '—'} à ${item.status}`); res.json({ success: true, data: item }); });
exports.deleteCompanyProfile = asyncHandler(async (req, res) => { const item = await CompanyProfile.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Profil introuvable' }); res.json({ success: true, data: item }); });
