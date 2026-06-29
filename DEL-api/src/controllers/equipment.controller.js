const { z } = require('zod');
const Equipment = require('../models/Equipment');
const asyncHandler = require('../utils/asyncHandler');

const equipmentSchema = z.object({ ownerName: z.string().min(1), ownerPhone: z.string().min(1), title: z.string().min(1), category: z.string().min(1), brand: z.string().optional(), model: z.string().optional(), year: z.coerce.number().optional(), country: z.string().optional(), city: z.string().optional(), salePrice: z.coerce.number().optional(), rentalPricePerMonth: z.coerce.number().optional(), services: z.record(z.boolean()).optional() }).passthrough();
const updateSchema = equipmentSchema.partial();

exports.createEquipment = asyncHandler(async (req, res) => { const data = equipmentSchema.parse(req.body); const equipment = await Equipment.create(data); res.status(201).json({ success: true, data: equipment }); });
exports.getEquipment = asyncHandler(async (req, res) => { const items = await Equipment.find().sort({ createdAt: -1 }); res.json({ success: true, count: items.length, data: items }); });
exports.getEquipmentById = asyncHandler(async (req, res) => { const item = await Equipment.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Equipment not found' }); res.json({ success: true, data: item }); });
exports.updateEquipment = asyncHandler(async (req, res) => { const data = updateSchema.parse(req.body); const item = await Equipment.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Equipment not found' }); res.json({ success: true, data: item }); });
exports.deleteEquipment = asyncHandler(async (req, res) => { const item = await Equipment.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Equipment not found' }); res.json({ success: true, data: null }); });
