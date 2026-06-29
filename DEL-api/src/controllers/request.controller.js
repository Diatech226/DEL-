const { z } = require('zod');
const EquipmentRequest = require('../models/EquipmentRequest');
const asyncHandler = require('../utils/asyncHandler');

const requestSchema = z.object({ companyName: z.string().min(1), contactName: z.string().min(1), contactPhone: z.string().min(1), equipmentCategory: z.string().min(1), quantity: z.coerce.number().min(1), title: z.string().optional(), country: z.string().optional(), city: z.string().optional(), workSiteLocation: z.string().optional(), durationMonths: z.coerce.number().optional(), proposedPrice: z.coerce.number().optional(), description: z.string().optional(), driverRequired: z.boolean().optional(), fuelIncluded: z.boolean().optional(), maintenanceIncluded: z.boolean().optional(), insuranceRequired: z.boolean().optional() }).passthrough();
const updateSchema = requestSchema.partial();

exports.createRequest = asyncHandler(async (req, res) => { const data = requestSchema.parse(req.body); const item = await EquipmentRequest.create(data); res.status(201).json({ success: true, data: item }); });
exports.getRequests = asyncHandler(async (req, res) => { const items = await EquipmentRequest.find().sort({ createdAt: -1 }); res.json({ success: true, count: items.length, data: items }); });
exports.getRequestById = asyncHandler(async (req, res) => { const item = await EquipmentRequest.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Request not found' }); res.json({ success: true, data: item }); });
exports.updateRequest = asyncHandler(async (req, res) => { const data = updateSchema.parse(req.body); const item = await EquipmentRequest.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Request not found' }); res.json({ success: true, data: item }); });
exports.deleteRequest = asyncHandler(async (req, res) => { const item = await EquipmentRequest.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Request not found' }); res.json({ success: true, data: null }); });
