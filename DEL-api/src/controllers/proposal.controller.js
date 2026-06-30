const { z } = require('zod');
const mongoose = require('mongoose');
const Proposal = require('../models/Proposal');
const Equipment = require('../models/Equipment');
const EquipmentRequest = require('../models/EquipmentRequest');
const Contract = require('../models/Contract');
const asyncHandler = require('../utils/asyncHandler');
const { updateSchedulesStatus } = require('../utils/equipmentSchedule.service');

const decisionStatuses = ['PENDING', 'ACCEPTED', 'REJECTED'];
const proposalSchema = z.object({
  requestId: z.string().min(1, 'requestId est obligatoire'), equipmentIds: z.array(z.string()).optional(), companyName: z.string().optional(), ownerNames: z.array(z.string()).optional(),
  title: z.string().trim().min(1, 'title est obligatoire'), finalPrice: z.coerce.number({ invalid_type_error: 'finalPrice est obligatoire' }), currency: z.enum(['XOF','USD','EUR'], { required_error: 'currency est obligatoire' }),
  durationMonths: z.coerce.number().optional(), conditions: z.string().optional(), status: z.string().optional(), workflowStatus: z.string().optional(), companyDecision: z.any().optional(), ownerDecisions: z.array(z.any()).optional(),
}).passthrough();
const updateSchema = proposalSchema.partial();
const statusSchema = z.object({ status: z.enum(['DRAFT','SENT','ACCEPTED','REJECTED','EXPIRED']) });
const decisionSchema = z.object({ status: z.enum(['ACCEPTED', 'REJECTED']), notes: z.string().optional(), rejectionReason: z.string().optional() });

function recalculateProposalWorkflow(proposal) {
  if (!proposal.companyDecision) proposal.companyDecision = { status: 'PENDING' };
  if (!Array.isArray(proposal.ownerDecisions)) proposal.ownerDecisions = [];
  const companyStatus = proposal.companyDecision.status || 'PENDING';
  if (companyStatus === 'REJECTED') { proposal.workflowStatus = 'REJECTED_BY_COMPANY'; proposal.status = 'REJECTED'; return proposal; }
  if (proposal.ownerDecisions.some((d) => d.status === 'REJECTED')) { proposal.workflowStatus = 'REJECTED_BY_OWNER'; proposal.status = 'REJECTED'; return proposal; }
  if (companyStatus === 'PENDING') { proposal.workflowStatus = 'PENDING_COMPANY'; proposal.status = 'SENT'; return proposal; }
  if (companyStatus === 'ACCEPTED' && proposal.ownerDecisions.some((d) => (d.status || 'PENDING') === 'PENDING')) { proposal.workflowStatus = 'PENDING_OWNERS'; proposal.status = 'SENT'; return proposal; }
  if (companyStatus === 'ACCEPTED' && proposal.ownerDecisions.every((d) => d.status === 'ACCEPTED')) { proposal.workflowStatus = 'READY_FOR_CONTRACT'; proposal.status = 'ACCEPTED'; }
  return proposal;
}

async function releaseProposalReservations(proposal, equipmentIds = proposal.equipmentIds || []) {
  await updateSchedulesStatus('PROPOSAL', proposal._id, 'RESERVED', 'CANCELLED');
  const ids = equipmentIds.map((id) => new mongoose.Types.ObjectId(String(id)));
  if (!ids.length) return;
  const activeProposalEquipment = await Proposal.distinct('equipmentIds', { _id: { $ne: proposal._id }, status: { $in: ['SENT', 'ACCEPTED'] }, equipmentIds: { $in: ids } });
  const activeContractEquipment = await Contract.distinct('equipmentIds', { status: { $in: ['DRAFT', 'PENDING_SIGNATURE', 'ACTIVE'] }, equipmentIds: { $in: ids } });
  const blocked = new Set([...activeProposalEquipment, ...activeContractEquipment].map(String));
  const releasable = ids.filter((id) => !blocked.has(String(id)));
  if (releasable.length) await Equipment.updateMany({ _id: { $in: releasable }, status: 'RESERVED' }, { status: 'AVAILABLE' }, { runValidators: true });
}

async function saveDecision(proposal, decisionChangedRejected, releaseIds) {
  recalculateProposalWorkflow(proposal);
  await proposal.save();
  if (proposal.status === 'REJECTED' || decisionChangedRejected) await releaseProposalReservations(proposal, releaseIds);
  return proposal;
}

exports.recalculateProposalWorkflow = recalculateProposalWorkflow;
exports.releaseProposalReservations = releaseProposalReservations;
exports.createProposal = asyncHandler(async (req, res) => { const data = proposalSchema.parse(req.body); const item = await Proposal.create({ ...data, status: data.status || 'SENT', workflowStatus: data.workflowStatus || 'PENDING_COMPANY', companyDecision: data.companyDecision || { status: 'PENDING' } }); res.status(201).json({ success: true, data: item }); });
exports.getProposals = asyncHandler(async (req, res) => { const items = await Proposal.find().sort({ createdAt: -1 }); res.json({ success: true, count: items.length, data: items }); });
exports.getProposalById = asyncHandler(async (req, res) => { const item = await Proposal.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Proposition introuvable' }); res.json({ success: true, data: item }); });
exports.updateProposal = asyncHandler(async (req, res) => { const data = updateSchema.parse(req.body); const item = await Proposal.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Proposition introuvable' }); res.json({ success: true, data: item }); });
exports.updateProposalStatus = asyncHandler(async (req, res) => { const { status } = statusSchema.parse(req.body); const item = await Proposal.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Proposition introuvable' }); if (['REJECTED','EXPIRED'].includes(status)) await releaseProposalReservations(item); res.json({ success: true, data: item }); });
exports.deleteProposal = asyncHandler(async (req, res) => { const item = await Proposal.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Proposition introuvable' }); res.json({ success: true, data: item }); });

exports.submitMyCompanyDecision = asyncHandler(async (req, res) => {
  if (req.user.role !== 'COMPANY') return res.status(403).json({ success: false, message: 'Réservé aux entreprises' });
  const data = decisionSchema.parse(req.body); const proposal = await Proposal.findById(req.params.id); if (!proposal) return res.status(404).json({ success: false, message: 'Proposition introuvable' });
  const request = await EquipmentRequest.findById(proposal.requestId); if (!request || String(request.companyUserId || '') !== String(req.user._id)) return res.status(403).json({ success: false, message: 'Proposition non liée à votre entreprise' });
  proposal.companyDecision = { status: data.status, decidedByUserId: req.user._id, decidedAt: new Date(), notes: data.notes, rejectionReason: data.rejectionReason };
  res.json({ success: true, data: await saveDecision(proposal, data.status === 'REJECTED') });
});

exports.submitMyOwnerDecision = asyncHandler(async (req, res) => {
  if (req.user.role !== 'OWNER') return res.status(403).json({ success: false, message: 'Réservé aux propriétaires' });
  const data = decisionSchema.parse(req.body); const proposal = await Proposal.findById(req.params.id); if (!proposal) return res.status(404).json({ success: false, message: 'Proposition introuvable' });
  const index = (proposal.ownerDecisions || []).findIndex((d) => String(d.ownerUserId || '') === String(req.user._id));
  if (index < 0) return res.status(403).json({ success: false, message: 'Aucun engin de cette proposition ne vous appartient' });
  proposal.ownerDecisions[index].status = data.status; proposal.ownerDecisions[index].decidedAt = new Date(); proposal.ownerDecisions[index].notes = data.notes; proposal.ownerDecisions[index].rejectionReason = data.rejectionReason;
  res.json({ success: true, data: await saveDecision(proposal, data.status === 'REJECTED', proposal.ownerDecisions[index].equipmentIds) });
});

exports.submitAdminCompanyDecision = asyncHandler(async (req, res) => {
  const data = decisionSchema.parse(req.body); const proposal = await Proposal.findById(req.params.id); if (!proposal) return res.status(404).json({ success: false, message: 'Proposition introuvable' });
  proposal.companyDecision = { status: data.status, decidedByUserId: req.user._id, decidedAt: new Date(), notes: data.notes, rejectionReason: data.rejectionReason };
  res.json({ success: true, data: await saveDecision(proposal, data.status === 'REJECTED') });
});

exports.submitAdminOwnerDecision = asyncHandler(async (req, res) => {
  const data = decisionSchema.parse(req.body); const proposal = await Proposal.findById(req.params.id); if (!proposal) return res.status(404).json({ success: false, message: 'Proposition introuvable' });
  const index = Number(req.params.index); if (!Number.isInteger(index) || !proposal.ownerDecisions[index]) return res.status(404).json({ success: false, message: 'Décision propriétaire introuvable' });
  proposal.ownerDecisions[index].status = data.status; proposal.ownerDecisions[index].decidedAt = new Date(); proposal.ownerDecisions[index].notes = data.notes; proposal.ownerDecisions[index].rejectionReason = data.rejectionReason;
  res.json({ success: true, data: await saveDecision(proposal, data.status === 'REJECTED', proposal.ownerDecisions[index].equipmentIds) });
});
