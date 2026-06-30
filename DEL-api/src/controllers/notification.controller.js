const { z } = require('zod');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

const schema = z.object({
  recipientUserId: z.string().optional().nullable(), recipientRole: z.enum(['OWNER','COMPANY','INVESTOR','TECHNICIAN','ADMIN','SYSTEM']).default('SYSTEM'), recipientName: z.string().optional(),
  title: z.string().trim().min(1, 'title est obligatoire'), message: z.string().trim().min(1, 'message est obligatoire'),
  type: z.enum(['PROPOSAL_CREATED','PROPOSAL_ACCEPTED','PROPOSAL_REJECTED','CONTRACT_CREATED','CONTRACT_STATUS_UPDATED','INVOICE_CREATED','INVOICE_STATUS_UPDATED','PAYMENT_CREATED','PAYMENT_STATUS_UPDATED','DOCUMENT_VERIFIED','DOCUMENT_REJECTED','MISSION_CREATED','MISSION_STATUS_UPDATED','MAINTENANCE_CREATED','MAINTENANCE_STATUS_UPDATED','PROFILE_VERIFIED','PROFILE_REJECTED','EQUIPMENT_STATUS_UPDATED','REQUEST_STATUS_UPDATED','SYSTEM']).default('SYSTEM'),
  relatedEntityType: z.enum(['PROPOSAL','CONTRACT','INVOICE','PAYMENT','DOCUMENT','MISSION','MAINTENANCE','PROFILE','EQUIPMENT','REQUEST','SYSTEM']).default('SYSTEM'), relatedEntityId: z.string().optional().nullable(), actionUrl: z.string().optional(), priority: z.enum(['LOW','NORMAL','HIGH','CRITICAL']).default('NORMAL'),
});

const listResponse = async (res, query) => { const data = await Notification.find(query).sort({ createdAt: -1 }); const unreadCount = await Notification.countDocuments({ ...query, isRead: false }); return res.json({ success: true, count: data.length, unreadCount, data }); };
exports.createNotificationManual = asyncHandler(async (req, res) => { const item = await Notification.create(schema.parse(req.body)); res.status(201).json({ success: true, data: item }); });
exports.getNotifications = asyncHandler(async (_req, res) => listResponse(res, {}));
exports.getNotificationById = asyncHandler(async (req, res) => { const item = await Notification.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Notification introuvable' }); res.json({ success: true, data: item }); });
exports.getMyNotifications = asyncHandler(async (req, res) => listResponse(res, { recipientUserId: req.user._id }));
exports.markNotificationAsRead = asyncHandler(async (req, res) => { const item = await Notification.findOneAndUpdate({ _id: req.params.id, recipientUserId: req.user._id }, { isRead: true, readAt: new Date() }, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Notification introuvable pour cet utilisateur' }); res.json({ success: true, data: item }); });
exports.markAllMyNotificationsAsRead = asyncHandler(async (req, res) => { await Notification.updateMany({ recipientUserId: req.user._id, isRead: false }, { isRead: true, readAt: new Date() }); return exports.getMyNotifications(req, res); });
exports.deleteNotification = asyncHandler(async (req, res) => { const item = await Notification.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Notification introuvable' }); res.json({ success: true, data: item }); });
