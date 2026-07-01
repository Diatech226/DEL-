const AuditLog = require('../models/AuditLog');

function userName(user) {
  return user?.fullName || user?.name || user?.email || user?.phone || undefined;
}

function getIp(req) {
  return req?.ip || req?.headers?.['x-forwarded-for']?.split(',')?.[0]?.trim() || req?.headers?.['x-real-ip'];
}

async function createAuditLog({ req, actorUserId, actorName, actorRole, action, module, entityType, entityId, entityLabel, oldValue, newValue, message, severity = 'NORMAL' }) {
  try {
    const actor = req?.user;
    await AuditLog.create({
      actorUserId: actor?._id || actorUserId,
      actorName: userName(actor) || actorName,
      actorRole: actor?.role || actorRole,
      action,
      module,
      entityType,
      entityId,
      entityLabel,
      oldValue,
      newValue,
      message,
      ipAddress: getIp(req),
      userAgent: req?.headers?.['user-agent'],
      severity,
    });
  } catch (error) {
    console.error('Audit log failed:', error.message);
  }
}

const labelOf = (item, keys = []) => keys.map((key) => item?.[key]).find(Boolean) || item?.title || item?.name || item?.fullName || item?.invoiceNumber || item?.contractNumber || item?.paymentNumber || item?.ticketNumber || item?._id?.toString?.();

async function auditCreate(req, module, entityType, item, message, severity = 'NORMAL', labelKeys = []) {
  return createAuditLog({ req, action: 'CREATE', module, entityType, entityId: item?._id, entityLabel: labelOf(item, labelKeys), newValue: { id: item?._id, status: item?.status }, message, severity });
}

async function auditStatusChange(req, module, entityType, item, oldStatus, newStatus, message, severity = 'NORMAL', labelKeys = []) {
  return createAuditLog({ req, action: 'STATUS_CHANGE', module, entityType, entityId: item?._id, entityLabel: labelOf(item, labelKeys), oldValue: { status: oldStatus }, newValue: { status: newStatus }, message: message || `Statut ${entityType.toLowerCase()} changé de ${oldStatus || '—'} à ${newStatus}`, severity });
}

module.exports = { createAuditLog, auditCreate, auditStatusChange, labelOf };
