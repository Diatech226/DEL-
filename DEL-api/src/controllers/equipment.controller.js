const { z } = require('zod');
const Equipment = require('../models/Equipment');
const asyncHandler = require('../utils/asyncHandler');
const createNotification = require('../utils/createNotification');

const equipmentSchema = z.object({
  ownerName: z.string().trim().min(1, 'ownerName est obligatoire'),
  ownerPhone: z.string().trim().min(1, 'ownerPhone est obligatoire'),
  title: z.string().trim().min(1, 'title est obligatoire'),
  category: z.string().trim().min(1, 'category est obligatoire'),
  country: z.string().trim().min(1, 'country est obligatoire'),
  city: z.string().trim().min(1, 'city est obligatoire'),
  brand: z.string().optional(), model: z.string().optional(), year: z.coerce.number().optional(),
  condition: z.string().optional(), engineHours: z.coerce.number().optional(), locationText: z.string().optional(),
  salePrice: z.coerce.number().optional(), rentalPricePerMonth: z.coerce.number().optional(), currency: z.enum(['XOF','USD','EUR']).optional(),
  services: z.record(z.boolean()).optional(), status: z.string().optional(),
}).passthrough();
const updateSchema = equipmentSchema.partial();
const statusSchema = z.object({ status: z.enum(['DRAFT','PENDING_REVIEW','AVAILABLE','RESERVED','PLACED','UNDER_MAINTENANCE','SOLD','REJECTED']) });

exports.createEquipment = asyncHandler(async (req, res) => { const data = equipmentSchema.parse(req.body); if (req.user && !data.ownerUserId) data.ownerUserId = req.user._id; const equipment = await Equipment.create(data); res.status(201).json({ success: true, data: equipment }); });
exports.getEquipment = asyncHandler(async (req, res) => { const items = await Equipment.find().sort({ createdAt: -1 }); res.json({ success: true, count: items.length, data: items }); });
exports.getEquipmentById = asyncHandler(async (req, res) => { const item = await Equipment.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Engin introuvable' }); res.json({ success: true, data: item }); });
exports.updateEquipment = asyncHandler(async (req, res) => { const data = updateSchema.parse(req.body); const item = await Equipment.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Engin introuvable' }); res.json({ success: true, data: item }); });
exports.updateEquipmentStatus = asyncHandler(async (req, res) => { const { status } = statusSchema.parse(req.body); const item = await Equipment.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Engin introuvable' }); if (item.ownerUserId) await createNotification({ recipientUserId: item.ownerUserId, recipientRole: 'OWNER', recipientName: item.ownerName, title: 'Statut engin mis à jour', message: `Le statut de votre engin est maintenant ${status}.`, type: 'EQUIPMENT_STATUS_UPDATED', relatedEntityType: 'EQUIPMENT', relatedEntityId: item._id, actionUrl: '/dashboard/equipment' }); res.json({ success: true, data: item }); });
exports.deleteEquipment = asyncHandler(async (req, res) => { const item = await Equipment.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Engin introuvable' }); res.json({ success: true, data: item }); });
