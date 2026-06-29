const { z } = require('zod');
const EquipmentRequest = require('../models/EquipmentRequest');
const asyncHandler = require('../utils/asyncHandler');

const requestSchema = z.object({
  companyName: z.string().trim().min(1, 'companyName est obligatoire'), contactName: z.string().trim().min(1, 'contactName est obligatoire'), contactPhone: z.string().trim().min(1, 'contactPhone est obligatoire'),
  equipmentCategory: z.string().trim().min(1, 'equipmentCategory est obligatoire'), quantity: z.coerce.number().min(1, 'quantity doit être supérieur à 0'), country: z.string().trim().min(1, 'country est obligatoire'), city: z.string().trim().min(1, 'city est obligatoire'),
  title: z.string().optional(), workSiteLocation: z.string().optional(), durationMonths: z.coerce.number().optional(), proposedPrice: z.coerce.number().optional(), currency: z.enum(['XOF','USD','EUR']).optional(), priceUnit: z.enum(['DAY','MONTH','PROJECT']).optional(),
  description: z.string().optional(), driverRequired: z.boolean().optional(), fuelIncluded: z.boolean().optional(), maintenanceIncluded: z.boolean().optional(), insuranceRequired: z.boolean().optional(), status: z.string().optional(),
}).passthrough();
const updateSchema = requestSchema.partial();
const statusSchema = z.object({ status: z.enum(['OPEN','MATCHING','PROPOSAL_SENT','NEGOTIATION','CONTRACT_PENDING','ACTIVE','COMPLETED','CANCELLED']) });
exports.createRequest = asyncHandler(async (req, res) => { const data = requestSchema.parse(req.body); const item = await EquipmentRequest.create(data); res.status(201).json({ success: true, data: item }); });
exports.getRequests = asyncHandler(async (req, res) => { const items = await EquipmentRequest.find().sort({ createdAt: -1 }); res.json({ success: true, count: items.length, data: items }); });
exports.getRequestById = asyncHandler(async (req, res) => { const item = await EquipmentRequest.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Demande introuvable' }); res.json({ success: true, data: item }); });
exports.updateRequest = asyncHandler(async (req, res) => { const data = updateSchema.parse(req.body); const item = await EquipmentRequest.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Demande introuvable' }); res.json({ success: true, data: item }); });
exports.updateRequestStatus = asyncHandler(async (req, res) => { const { status } = statusSchema.parse(req.body); const item = await EquipmentRequest.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Demande introuvable' }); res.json({ success: true, data: item }); });
exports.deleteRequest = asyncHandler(async (req, res) => { const item = await EquipmentRequest.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Demande introuvable' }); res.json({ success: true, data: item }); });
