const { z } = require('zod');
const Equipment = require('../models/Equipment');
const EquipmentSchedule = require('../models/EquipmentSchedule');
const asyncHandler = require('../utils/asyncHandler');
const { auditCreate, auditStatusChange } = require('../utils/audit');
const { hasScheduleConflict, createScheduleForEquipment } = require('../utils/equipmentSchedule.service');

const types = ['AVAILABLE', 'RESERVED', 'CONTRACT', 'MISSION', 'MAINTENANCE', 'UNAVAILABLE', 'BLOCKED'];
const entityTypes = ['PROPOSAL', 'CONTRACT', 'MISSION', 'MAINTENANCE', 'MANUAL', 'OTHER'];
const statuses = ['ACTIVE', 'CANCELLED', 'COMPLETED'];
const scheduleSchema = z.object({ equipmentId: z.string().min(1), type: z.enum(types), title: z.string().min(1), description: z.string().optional(), startDate: z.coerce.date(), endDate: z.coerce.date(), relatedEntityType: z.enum(entityTypes).default('MANUAL'), relatedEntityId: z.string().optional(), createdBy: z.string().optional(), notes: z.string().optional(), status: z.enum(statuses).optional() });
const updateSchema = scheduleSchema.partial();
const statusSchema = z.object({ status: z.enum(statuses) });

exports.createEquipmentSchedule = asyncHandler(async (req, res) => {
  const data = scheduleSchema.parse(req.body);
  const equipment = await Equipment.findById(data.equipmentId);
  if (!equipment) return res.status(404).json({ success: false, message: 'Engin introuvable' });
  if (data.endDate < data.startDate) return res.status(400).json({ success: false, message: 'La date de fin doit être après la date de début' });
  const conflicts = data.type === 'AVAILABLE' ? [] : await hasScheduleConflict(data.equipmentId, data.startDate, data.endDate);
  if (conflicts.length) return res.status(409).json({ success: false, message: 'Conflit de planning détecté', conflicts });
  const item = await createScheduleForEquipment(equipment, { ...data, status: 'ACTIVE' });
  await auditCreate(req, 'PLANNING', 'PLANNING', item, 'Planning créé'); res.status(201).json({ success: true, data: item });
});
exports.getEquipmentSchedules = asyncHandler(async (req, res) => { const q = {}; ['type','status','equipmentId'].forEach(k => { if (req.query[k]) q[k] = req.query[k]; }); if (req.query.startDate || req.query.endDate) { q.startDate = {}; if (req.query.endDate) q.startDate.$lte = new Date(req.query.endDate); q.endDate = {}; if (req.query.startDate) q.endDate.$gte = new Date(req.query.startDate); } const items = await EquipmentSchedule.find(q).sort({ startDate: -1 }); res.json({ success: true, count: items.length, data: items }); });
exports.getEquipmentScheduleById = asyncHandler(async (req, res) => { const item = await EquipmentSchedule.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Planning introuvable' }); res.json({ success: true, data: item }); });
exports.getSchedulesByEquipment = asyncHandler(async (req, res) => { const items = await EquipmentSchedule.find({ equipmentId: req.params.equipmentId }).sort({ startDate: -1 }); res.json({ success: true, count: items.length, data: items }); });
exports.getAvailabilityByEquipment = asyncHandler(async (req, res) => { const { startDate, endDate } = req.query; if (!startDate || !endDate) return res.status(400).json({ success: false, message: 'startDate et endDate sont obligatoires' }); const conflicts = await hasScheduleConflict(req.params.equipmentId, startDate, endDate); res.json({ success: true, data: { equipmentId: req.params.equipmentId, available: conflicts.length === 0, conflicts } }); });
exports.checkEquipmentAvailability = asyncHandler(async (req, res) => { const { equipmentIds = [], startDate, endDate } = req.body; if (!equipmentIds.length || !startDate || !endDate) return res.status(400).json({ success: false, message: 'equipmentIds, startDate et endDate sont obligatoires' }); const data = await Promise.all(equipmentIds.map(async (equipmentId) => { const conflicts = await hasScheduleConflict(equipmentId, startDate, endDate); return { equipmentId, available: conflicts.length === 0, conflicts }; })); res.json({ success: true, data }); });
exports.updateEquipmentSchedule = asyncHandler(async (req, res) => { const data = updateSchema.parse(req.body); const current = await EquipmentSchedule.findById(req.params.id); if (!current) return res.status(404).json({ success: false, message: 'Planning introuvable' }); const next = { ...current.toObject(), ...data }; if (next.type !== 'AVAILABLE' && next.status === 'ACTIVE') { const conflicts = await hasScheduleConflict(next.equipmentId, next.startDate, next.endDate, current._id); if (conflicts.length) return res.status(409).json({ success: false, message: 'Conflit de planning détecté', conflicts }); } Object.assign(current, data); await current.save(); res.json({ success: true, data: current }); });
exports.updateEquipmentScheduleStatus = asyncHandler(async (req, res) => { const { status } = statusSchema.parse(req.body); const before = await EquipmentSchedule.findById(req.params.id); const item = before && await EquipmentSchedule.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Planning introuvable' }); await auditStatusChange(req, 'PLANNING', 'PLANNING', item, before?.status, item.status, `Statut planning changé de ${before?.status || '—'} à ${item.status}`); res.json({ success: true, data: item }); });
exports.deleteEquipmentSchedule = asyncHandler(async (req, res) => { const item = await EquipmentSchedule.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Planning introuvable' }); res.json({ success: true, data: item }); });
exports.hasScheduleConflict = hasScheduleConflict;
