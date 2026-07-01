const AuditLog = require('../models/AuditLog');
const asyncHandler = require('../utils/asyncHandler');

function buildQuery(query) {
  const filter = {};
  ['module','action','actorRole','entityType','entityId','severity'].forEach((key) => { if (query[key]) filter[key] = query[key]; });
  if (query.dateFrom || query.dateTo) {
    filter.createdAt = {};
    if (query.dateFrom) filter.createdAt.$gte = new Date(query.dateFrom);
    if (query.dateTo) filter.createdAt.$lte = new Date(query.dateTo);
  }
  return filter;
}

exports.getAuditLogs = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
  const data = await AuditLog.find(buildQuery(req.query)).sort({ createdAt: -1 }).limit(limit);
  res.json({ success: true, count: data.length, data });
});

exports.getAuditLogById = asyncHandler(async (req, res) => {
  const item = await AuditLog.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Audit introuvable' });
  return res.json({ success: true, data: item });
});

exports.getAuditLogsByEntity = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
  const data = await AuditLog.find({ entityType: req.params.entityType, entityId: req.params.entityId }).sort({ createdAt: -1 }).limit(limit);
  res.json({ success: true, count: data.length, data });
});

exports.deleteAuditLog = asyncHandler(async (req, res) => {
  const item = await AuditLog.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Audit introuvable' });
  return res.json({ success: true, data: item });
});
