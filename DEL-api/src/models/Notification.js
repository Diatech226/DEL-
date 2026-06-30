const mongoose = require('mongoose');

const recipientRoles = ['OWNER', 'COMPANY', 'INVESTOR', 'TECHNICIAN', 'ADMIN', 'SYSTEM'];
const notificationTypes = ['PROPOSAL_CREATED','PROPOSAL_ACCEPTED','PROPOSAL_REJECTED','CONTRACT_CREATED','CONTRACT_STATUS_UPDATED','INVOICE_CREATED','INVOICE_STATUS_UPDATED','PAYMENT_CREATED','PAYMENT_STATUS_UPDATED','DOCUMENT_VERIFIED','DOCUMENT_REJECTED','MISSION_CREATED','MISSION_STATUS_UPDATED','MAINTENANCE_CREATED','MAINTENANCE_STATUS_UPDATED','PROFILE_VERIFIED','PROFILE_REJECTED','EQUIPMENT_STATUS_UPDATED','REQUEST_STATUS_UPDATED','SYSTEM'];
const entityTypes = ['PROPOSAL','CONTRACT','INVOICE','PAYMENT','DOCUMENT','MISSION','MAINTENANCE','PROFILE','EQUIPMENT','REQUEST','SYSTEM'];
const priorities = ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'];

const notificationSchema = new mongoose.Schema({
  recipientUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, default: null },
  recipientRole: { type: String, enum: recipientRoles, default: 'SYSTEM', index: true },
  recipientName: { type: String, trim: true },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  type: { type: String, enum: notificationTypes, default: 'SYSTEM', index: true },
  relatedEntityType: { type: String, enum: entityTypes, default: 'SYSTEM', index: true },
  relatedEntityId: { type: mongoose.Schema.Types.ObjectId, default: null, index: true },
  actionUrl: { type: String, trim: true },
  priority: { type: String, enum: priorities, default: 'NORMAL', index: true },
  readAt: { type: Date, default: null },
  isRead: { type: Boolean, default: false, index: true },
}, { timestamps: true });

notificationSchema.index({ recipientUserId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
