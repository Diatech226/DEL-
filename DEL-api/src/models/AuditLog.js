const mongoose = require('mongoose');

const actions = ['CREATE','UPDATE','DELETE','STATUS_CHANGE','LOGIN','LOGOUT','REGISTER','APPROVE','REJECT','DOWNLOAD','EXPORT','PAYMENT_RECORD','MESSAGE_SENT','NOTIFICATION_SENT','SETTINGS_UPDATE','SYSTEM'];
const modules = ['AUTH','USER','OWNER','COMPANY','TECHNICIAN','EQUIPMENT','REQUEST','TENDER','TENDER_LOT','TENDER_SUBMISSION','PROPOSAL','CONTRACT','INVOICE','PAYMENT','DOCUMENT','MISSION','MISSION_REPORT','MAINTENANCE','PLANNING','SCORING','REPORT','SETTINGS','NOTIFICATION','MESSAGE','SYSTEM'];
const severities = ['LOW','NORMAL','HIGH','CRITICAL'];

const auditLogSchema = new mongoose.Schema({
  actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorName: { type: String, trim: true },
  actorRole: { type: String, trim: true },
  action: { type: String, enum: actions, required: true, index: true },
  module: { type: String, enum: modules, required: true, index: true },
  entityType: { type: String, trim: true, index: true },
  entityId: { type: mongoose.Schema.Types.Mixed, index: true },
  entityLabel: { type: String, trim: true },
  oldValue: { type: mongoose.Schema.Types.Mixed },
  newValue: { type: mongoose.Schema.Types.Mixed },
  message: { type: String, trim: true },
  ipAddress: { type: String, trim: true },
  userAgent: { type: String, trim: true },
  severity: { type: String, enum: severities, default: 'NORMAL', index: true },
  createdAt: { type: Date, default: Date.now, index: true },
});

auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
module.exports.actions = actions;
module.exports.modules = modules;
module.exports.severities = severities;
