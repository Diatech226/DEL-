const { z } = require('zod');
const Contract = require('../models/Contract');
const Proposal = require('../models/Proposal');
const EquipmentRequest = require('../models/EquipmentRequest');
const Equipment = require('../models/Equipment');
const asyncHandler = require('../utils/asyncHandler');
const generateContractNumber = require('../utils/generateContractNumber');
const { createScheduleForEquipment, normalizePeriod, updateSchedulesStatus } = require('../utils/equipmentSchedule.service');
const { notifyStakeholders } = require('../utils/createNotification');
const { auditCreate, auditStatusChange } = require('../utils/audit');
const { getOrCreateSettings } = require('../utils/settings.service');

const statuses = ['DRAFT', 'PENDING_SIGNATURE', 'ACTIVE', 'COMPLETED', 'CANCELLED'];
const createSchema = z.object({
  startDate: z.coerce.date().optional(), endDate: z.coerce.date().optional(), durationMonths: z.coerce.number().optional(),
  paymentTerms: z.string().optional(), platformCommissionRate: z.coerce.number().min(0).max(100).optional(),
  conditions: z.string().optional(), responsibilities: z.string().optional(),
}).passthrough();
const updateSchema = z.object({
  startDate: z.coerce.date().optional(), endDate: z.coerce.date().optional(), durationMonths: z.coerce.number().optional(),
  paymentTerms: z.string().optional(), platformCommissionRate: z.coerce.number().min(0).max(100).optional(),
  conditions: z.string().optional(), responsibilities: z.string().optional(), title: z.string().optional(),
}).passthrough();
const statusSchema = z.object({ status: z.enum(statuses) });

async function uniqueContractNumber(prefix) {
  for (let i = 0; i < 5; i += 1) {
    const contractNumber = generateContractNumber(new Date(), prefix);
    // eslint-disable-next-line no-await-in-loop
    const exists = await Contract.exists({ contractNumber });
    if (!exists) return contractNumber;
  }
  return `${generateContractNumber(new Date(), prefix)}-${Date.now().toString().slice(-3)}`;
}

exports.createContractFromProposal = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findById(req.params.id);
  if (!proposal) return res.status(404).json({ success: false, message: 'Proposition introuvable' });
  const data = createSchema.parse(req.body);
  const settings = await getOrCreateSettings();
  const forceAllowed = data.force === true && req.user?.role === 'ADMIN';
  if (!forceAllowed && proposal.workflowStatus !== 'READY_FOR_CONTRACT' && proposal.status !== 'ACCEPTED') {
    return res.status(400).json({ success: false, message: 'La proposition doit être acceptée par l’entreprise et les propriétaires avant création du contrat.' });
  }
  const request = await EquipmentRequest.findById(proposal.requestId);
  if (!request) return res.status(404).json({ success: false, message: 'Demande liée introuvable' });
  const equipment = await Equipment.find({ _id: { $in: proposal.equipmentIds || [] } });
  const amount = Number(proposal.finalPrice || 0);
  const platformCommissionRate = Number(data.platformCommissionRate ?? settings.defaultPlatformCommissionRate ?? 0);
  const platformCommissionAmount = amount * platformCommissionRate / 100;
  const ownerAmount = amount - platformCommissionAmount;
  const contract = await Contract.create({
    proposalId: proposal._id, requestId: request._id, equipmentIds: proposal.equipmentIds || [],
    companyName: proposal.companyName || request.companyName, ownerNames: proposal.ownerNames?.length ? proposal.ownerNames : [...new Set(equipment.map((e) => e.ownerName).filter(Boolean))],
    title: proposal.title || request.title || 'Contrat DEL', contractNumber: await uniqueContractNumber(settings.contractPrefix || 'DEL-CTR'),
    startDate: data.startDate, endDate: data.endDate, durationMonths: data.durationMonths ?? proposal.durationMonths,
    amount, currency: proposal.currency || request.currency || 'XOF', paymentTerms: data.paymentTerms,
    platformCommissionRate, platformCommissionAmount, ownerAmount, conditions: data.conditions ?? proposal.conditions,
    responsibilities: data.responsibilities, status: 'PENDING_SIGNATURE',
  });
  const period = normalizePeriod(contract.startDate, contract.endDate, contract.durationMonths || proposal.durationMonths);
  await Promise.all(equipment.map((item) => createScheduleForEquipment(item, { type: 'CONTRACT', title: 'Contrat actif ou en préparation', startDate: period.start, endDate: period.end, relatedEntityType: 'CONTRACT', relatedEntityId: contract._id, createdBy: 'DEL-api' })));
  await Proposal.findByIdAndUpdate(proposal._id, { workflowStatus: 'CONTRACT_CREATED' }, { runValidators: true });
  await EquipmentRequest.findByIdAndUpdate(request._id, { status: 'CONTRACTED' }, { runValidators: true });
  await Equipment.updateMany({ _id: { $in: proposal.equipmentIds || [] } }, { status: 'RESERVED' }, { runValidators: true });
  await notifyStakeholders({ request, equipment, title: 'Contrat créé', message: 'Un contrat a été créé pour votre proposition.', type: 'CONTRACT_CREATED', relatedEntityType: 'CONTRACT', relatedEntityId: contract._id, actionUrl: '/dashboard/contracts' });
  await auditCreate(req, 'CONTRACT', 'CONTRACT', contract, 'Contrat créé', 'NORMAL', ['contractNumber','title']); res.status(201).json({ success: true, message: 'Contrat créé avec succès', data: contract });
});
exports.getContracts = asyncHandler(async (req, res) => { const items = await Contract.find().sort({ createdAt: -1 }); res.json({ success: true, count: items.length, data: items }); });
exports.getContractById = asyncHandler(async (req, res) => { const item = await Contract.findById(req.params.id).populate('equipmentIds'); if (!item) return res.status(404).json({ success: false, message: 'Contrat introuvable' }); res.json({ success: true, data: item }); });
exports.updateContract = asyncHandler(async (req, res) => { const data = updateSchema.parse(req.body); if (data.platformCommissionRate !== undefined) { const current = await Contract.findById(req.params.id); if (!current) return res.status(404).json({ success: false, message: 'Contrat introuvable' }); data.platformCommissionAmount = current.amount * data.platformCommissionRate / 100; data.ownerAmount = current.amount - data.platformCommissionAmount; } const item = await Contract.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Contrat introuvable' }); res.json({ success: true, data: item }); });
exports.updateContractStatus = asyncHandler(async (req, res) => { const { status } = statusSchema.parse(req.body); const before = await Contract.findById(req.params.id); const item = before && await Contract.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Contrat introuvable' }); if (status === 'ACTIVE') { await EquipmentRequest.findByIdAndUpdate(item.requestId, { status: 'ACTIVE' }, { runValidators: true }); await Equipment.updateMany({ _id: { $in: item.equipmentIds } }, { status: 'PLACED' }, { runValidators: true }); } if (status === 'COMPLETED') { await updateSchedulesStatus('CONTRACT', item._id, 'CONTRACT', 'COMPLETED'); await EquipmentRequest.findByIdAndUpdate(item.requestId, { status: 'COMPLETED' }, { runValidators: true }); await Equipment.updateMany({ _id: { $in: item.equipmentIds } }, { status: 'AVAILABLE' }, { runValidators: true }); } if (status === 'CANCELLED') { await updateSchedulesStatus('CONTRACT', item._id, 'CONTRACT', 'CANCELLED'); await EquipmentRequest.findByIdAndUpdate(item.requestId, { status: 'CANCELLED' }, { runValidators: true }); await Equipment.updateMany({ _id: { $in: item.equipmentIds } }, { status: 'AVAILABLE' }, { runValidators: true }); } await auditStatusChange(req, 'CONTRACT', 'CONTRACT', item, before?.status, item.status, `Statut contrat changé de ${before?.status || '—'} à ${item.status}`, 'NORMAL', ['contractNumber','title']); res.json({ success: true, data: item }); });
exports.deleteContract = asyncHandler(async (req, res) => { const item = await Contract.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Contrat introuvable' }); res.json({ success: true, data: item }); });
