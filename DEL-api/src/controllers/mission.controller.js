const { z } = require('zod');
const Contract = require('../models/Contract');
const Mission = require('../models/Mission');
const asyncHandler = require('../utils/asyncHandler');
const generateMissionNumber = require('../utils/generateMissionNumber');
const Equipment = require('../models/Equipment');
const { createScheduleForEquipment, normalizePeriod, updateSchedulesStatus } = require('../utils/equipmentSchedule.service');

const missionStatuses = ['PLANNED', 'IN_TRANSIT', 'ON_SITE', 'PAUSED', 'COMPLETED', 'CANCELLED'];
const missionTypes = ['MINE', 'BTP', 'LOGISTICS', 'AGRICULTURE', 'ENERGY', 'OTHER'];
const allowedContractStatuses = ['ACTIVE', 'PENDING_SIGNATURE', 'DRAFT'];
const missionSchema = z.object({
  title: z.string().min(2), missionType: z.enum(missionTypes).default('OTHER'), country: z.string().optional(), city: z.string().optional(), siteName: z.string().optional(), siteLocationText: z.string().optional(), siteContactName: z.string().optional(), siteContactPhone: z.string().optional(), plannedStartDate: z.coerce.date().optional(), plannedEndDate: z.coerce.date().optional(), actualStartDate: z.coerce.date().optional(), actualEndDate: z.coerce.date().optional(), departureDate: z.coerce.date().optional(), arrivalDate: z.coerce.date().optional(), notes: z.string().optional(),
}).passthrough();
const updateSchema = missionSchema.partial().extend({ totalDistanceKm: z.coerce.number().optional(), totalEngineHours: z.coerce.number().optional(), totalFuelLiters: z.coerce.number().optional(), status: z.enum(missionStatuses).optional() });
const statusSchema = z.object({ status: z.enum(missionStatuses) });

async function uniqueMissionNumber() { for (let i = 0; i < 5; i += 1) { const n = generateMissionNumber(); // eslint-disable-next-line no-await-in-loop
    if (!(await Mission.exists({ missionNumber: n }))) return n; } return `${generateMissionNumber()}-${Date.now().toString().slice(-3)}`; }

exports.createMissionFromContract = asyncHandler(async (req, res) => {
  const contract = await Contract.findById(req.params.id);
  if (!contract) return res.status(404).json({ success: false, message: 'Contrat introuvable' });
  if (!allowedContractStatuses.includes(contract.status)) return res.status(400).json({ success: false, message: 'Le contrat doit être DRAFT, PENDING_SIGNATURE ou ACTIVE pour préparer une mission' });
  const data = missionSchema.parse(req.body);
  const mission = await Mission.create({ ...data, missionNumber: await uniqueMissionNumber(), contractId: contract._id, requestId: contract.requestId, equipmentIds: contract.equipmentIds || [], companyName: contract.companyName, ownerNames: contract.ownerNames || [], status: 'PLANNED' });
  const equipment = await Equipment.find({ _id: { $in: contract.equipmentIds || [] } });
  const period = normalizePeriod(mission.plannedStartDate, mission.plannedEndDate, contract.durationMonths);
  await Promise.all(equipment.map((item) => createScheduleForEquipment(item, { type: 'MISSION', title: 'Mission planifiée', startDate: period.start, endDate: period.end, relatedEntityType: 'MISSION', relatedEntityId: mission._id, createdBy: 'DEL-api' })));
  res.status(201).json({ success: true, data: mission });
});
exports.getMissions = asyncHandler(async (req, res) => { const items = await Mission.find().sort({ createdAt: -1 }).populate('equipmentIds'); res.json({ success: true, count: items.length, data: items }); });
exports.getMissionById = asyncHandler(async (req, res) => { const item = await Mission.findById(req.params.id).populate('equipmentIds'); if (!item) return res.status(404).json({ success: false, message: 'Mission introuvable' }); res.json({ success: true, data: item }); });
exports.updateMission = asyncHandler(async (req, res) => { const data = updateSchema.parse(req.body); const item = await Mission.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Mission introuvable' }); res.json({ success: true, data: item }); });
exports.updateMissionStatus = asyncHandler(async (req, res) => { const { status } = statusSchema.parse(req.body); const current = await Mission.findById(req.params.id); if (!current) return res.status(404).json({ success: false, message: 'Mission introuvable' }); current.status = status; if (status === 'COMPLETED' && !current.actualEndDate) current.actualEndDate = new Date(); await current.save(); if (status === 'COMPLETED') await updateSchedulesStatus('MISSION', current._id, 'MISSION', 'COMPLETED'); if (status === 'CANCELLED') await updateSchedulesStatus('MISSION', current._id, 'MISSION', 'CANCELLED'); res.json({ success: true, data: current }); });
exports.deleteMission = asyncHandler(async (req, res) => { const item = await Mission.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Mission introuvable' }); res.json({ success: true, data: item }); });
