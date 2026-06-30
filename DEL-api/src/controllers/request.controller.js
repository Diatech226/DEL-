const { z } = require('zod');
const EquipmentRequest = require('../models/EquipmentRequest');
const Equipment = require('../models/Equipment');
const Proposal = require('../models/Proposal');
const asyncHandler = require('../utils/asyncHandler');
const { hasScheduleConflict, createScheduleForEquipment, normalizePeriod } = require('../utils/equipmentSchedule.service');
const createNotification = require('../utils/createNotification');

const statuses = ['OPEN','MATCHING','PROPOSAL_SENT','NEGOTIATION','CONTRACT_PENDING','ACTIVE','COMPLETED','CANCELLED'];
const requestSchema = z.object({
  companyName: z.string().trim().min(1, 'companyName est obligatoire'), contactName: z.string().trim().min(1, 'contactName est obligatoire'), contactPhone: z.string().trim().min(1, 'contactPhone est obligatoire'),
  equipmentCategory: z.string().trim().min(1, 'equipmentCategory est obligatoire'), quantity: z.coerce.number().min(1, 'quantity doit être supérieur à 0'), country: z.string().trim().min(1, 'country est obligatoire'), city: z.string().trim().min(1, 'city est obligatoire'),
  title: z.string().optional(), workSiteLocation: z.string().optional(), durationMonths: z.coerce.number().optional(), proposedPrice: z.coerce.number().optional(), currency: z.enum(['XOF','USD','EUR']).optional(), priceUnit: z.enum(['DAY','MONTH','PROJECT']).optional(),
  description: z.string().optional(), driverRequired: z.boolean().optional(), fuelIncluded: z.boolean().optional(), maintenanceIncluded: z.boolean().optional(), insuranceRequired: z.boolean().optional(), status: z.enum(statuses).optional(),
}).passthrough();
const updateSchema = requestSchema.partial();
const statusSchema = z.object({ status: z.enum(statuses) });
const proposalFromRequestSchema = z.object({
  equipmentIds: z.array(z.string().min(1)).min(1, 'equipmentIds ne doit pas être vide'),
  title: z.string().trim().min(1, 'title est obligatoire'),
  finalPrice: z.coerce.number({ invalid_type_error: 'finalPrice est obligatoire' }),
  currency: z.enum(['XOF','USD','EUR']).default('XOF'),
  durationMonths: z.coerce.number().optional(),
  conditions: z.string().optional(),
});

const same = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
function scoreEquipment(equipment, request) {
  let score = 0;
  const reasons = [];
  if (same(equipment.category, request.equipmentCategory)) { score += 40; reasons.push('Catégorie compatible'); }
  if (equipment.status === 'AVAILABLE') { score += 20; reasons.push('Engin disponible'); }
  if (request.country && same(equipment.country, request.country)) { score += 15; reasons.push('Même pays'); }
  if (request.city && same(equipment.city, request.city)) { score += 15; reasons.push('Même ville'); }
  if (request.proposedPrice && equipment.rentalPricePerMonth && equipment.rentalPricePerMonth <= request.proposedPrice) { score += 10; reasons.push('Prix compatible'); }
  return { score, reasons };
}

exports.createRequest = asyncHandler(async (req, res) => { const data = requestSchema.parse(req.body); if (req.user && !data.companyUserId) data.companyUserId = req.user._id; const item = await EquipmentRequest.create(data); res.status(201).json({ success: true, data: item }); });
exports.getRequests = asyncHandler(async (req, res) => { const items = await EquipmentRequest.find().sort({ createdAt: -1 }); res.json({ success: true, count: items.length, data: items }); });
exports.getRequestById = asyncHandler(async (req, res) => { const item = await EquipmentRequest.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Demande introuvable' }); res.json({ success: true, data: item }); });
exports.getRequestMatches = asyncHandler(async (req, res) => {
  const request = await EquipmentRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ success: false, message: 'Demande introuvable pour le matching' });
  const query = { category: request.equipmentCategory, status: 'AVAILABLE' };
  if (request.country) query.country = new RegExp(`^${request.country.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
  const equipment = await Equipment.find(query).sort({ createdAt: -1 });
  const period = normalizePeriod(request.startDate, request.endDate, request.durationMonths);
  const matches = [];
  for (const item of equipment) {
    // eslint-disable-next-line no-await-in-loop
    const conflicts = await hasScheduleConflict(item._id, period.start, period.end);
    if (conflicts.length) continue;
    const scored = scoreEquipment(item, request);
    scored.score += 15;
    scored.reasons.push('Disponible sur la période demandée');
    matches.push({ equipment: item, available: true, conflicts: [], ...scored });
  }
  const data = matches.sort((a, b) => b.score - a.score);
  res.json({ success: true, request, count: data.length, data });
});
exports.createProposalFromRequest = asyncHandler(async (req, res) => {
  const request = await EquipmentRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ success: false, message: 'Demande introuvable pour créer une proposition' });
  const data = proposalFromRequestSchema.parse(req.body);
  const equipment = await Equipment.find({ _id: { $in: data.equipmentIds } });
  if (equipment.length !== data.equipmentIds.length) return res.status(400).json({ success: false, message: 'Un ou plusieurs engins sont introuvables' });
  const period = normalizePeriod(request.startDate, request.endDate, data.durationMonths || request.durationMonths);
  const conflictsByEquipment = [];
  for (const item of equipment) {
    // eslint-disable-next-line no-await-in-loop
    const conflicts = await hasScheduleConflict(item._id, period.start, period.end);
    if (conflicts.length) conflictsByEquipment.push({ equipmentId: item._id, equipmentTitle: item.title, conflicts });
  }
  if (conflictsByEquipment.length) return res.status(409).json({ success: false, message: 'Conflit de planning détecté', conflicts: conflictsByEquipment });
  const ownerGroups = new Map();
  equipment.forEach((item) => {
    const key = item.ownerUserId ? String(item.ownerUserId) : `name:${item.ownerName || 'Propriétaire'}`;
    const current = ownerGroups.get(key) || { ownerUserId: item.ownerUserId || null, ownerName: item.ownerName || 'Propriétaire', equipmentIds: [], status: 'PENDING' };
    current.equipmentIds.push(item._id);
    ownerGroups.set(key, current);
  });
  const proposal = await Proposal.create({
    ...data,
    requestId: request._id,
    companyName: request.companyName,
    ownerNames: [...new Set(equipment.map((e) => e.ownerName).filter(Boolean))],
    status: 'SENT',
    workflowStatus: 'PENDING_COMPANY',
    companyDecision: { status: 'PENDING' },
    ownerDecisions: [...ownerGroups.values()],
  });
  await Promise.all(equipment.map((item) => createScheduleForEquipment(item, { type: 'RESERVED', title: 'Réservation proposition', description: data.conditions, startDate: period.start, endDate: period.end, relatedEntityType: 'PROPOSAL', relatedEntityId: proposal._id, createdBy: 'DEL-api' })));
  await EquipmentRequest.findByIdAndUpdate(request._id, { status: 'PROPOSAL_SENT' }, { runValidators: true });
  if (request.companyUserId) await createNotification({ recipientUserId: request.companyUserId, recipientRole: 'COMPANY', recipientName: request.companyName, title: 'Nouvelle proposition DEL', message: 'Une proposition a été préparée pour votre demande.', type: 'PROPOSAL_CREATED', relatedEntityType: 'PROPOSAL', relatedEntityId: proposal._id, actionUrl: '/dashboard/proposals', priority: 'HIGH' });
  await Promise.all([...ownerGroups.values()].filter((o) => o.ownerUserId).map((o) => createNotification({ recipientUserId: o.ownerUserId, recipientRole: 'OWNER', recipientName: o.ownerName, title: 'Nouvelle proposition pour votre engin', message: 'Votre engin a été sélectionné dans une proposition DEL.', type: 'PROPOSAL_CREATED', relatedEntityType: 'PROPOSAL', relatedEntityId: proposal._id, actionUrl: '/dashboard/proposals', priority: 'HIGH' })));
  await Equipment.updateMany({ _id: { $in: data.equipmentIds } }, { status: 'RESERVED' }, { runValidators: true });
  res.status(201).json({ success: true, data: proposal });
});
exports.updateRequest = asyncHandler(async (req, res) => { const data = updateSchema.parse(req.body); const item = await EquipmentRequest.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Demande introuvable' }); res.json({ success: true, data: item }); });
exports.updateRequestStatus = asyncHandler(async (req, res) => { const { status } = statusSchema.parse(req.body); const item = await EquipmentRequest.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Demande introuvable' }); if (item.companyUserId) await createNotification({ recipientUserId: item.companyUserId, recipientRole: 'COMPANY', recipientName: item.companyName, title: 'Statut de demande mis à jour', message: `Votre demande est maintenant ${status}.`, type: 'REQUEST_STATUS_UPDATED', relatedEntityType: 'REQUEST', relatedEntityId: item._id, actionUrl: '/dashboard/requests' }); res.json({ success: true, data: item }); });
exports.deleteRequest = asyncHandler(async (req, res) => { const item = await EquipmentRequest.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Demande introuvable' }); res.json({ success: true, data: item }); });
