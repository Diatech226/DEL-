const mongoose = require('mongoose');
const Document = require('../models/Document');
const asyncHandler = require('../utils/asyncHandler');

const requiredFields = ['title', 'type', 'entityType', 'entityId', 'fileUrl'];
const allowedStatuses = ['PENDING', 'VERIFIED', 'REJECTED'];
const allowedEntityTypes = ['EQUIPMENT', 'COMPANY', 'OWNER', 'REQUEST', 'CONTRACT'];

function validateRequired(body) {
  for (const field of requiredFields) {
    if (!body[field]) return `Le champ ${field} est obligatoire`;
  }
  if (!allowedEntityTypes.includes(body.entityType)) return 'entityType est invalide';
  if (!mongoose.Types.ObjectId.isValid(body.entityId)) return 'entityId est invalide';
  return null;
}

exports.createDocument = asyncHandler(async (req, res) => {
  const message = validateRequired(req.body);
  if (message) return res.status(400).json({ success: false, message });
  const document = await Document.create({ ...req.body, uploadedByUserId: req.body.uploadedByUserId || req.user?._id, status: req.body.status || 'PENDING' });
  res.status(201).json({ success: true, data: document });
});

exports.getDocuments = asyncHandler(async (_req, res) => {
  const documents = await Document.find().sort({ createdAt: -1 });
  res.json({ success: true, count: documents.length, data: documents });
});

exports.getDocumentById = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);
  if (!document) return res.status(404).json({ success: false, message: 'Document introuvable' });
  res.json({ success: true, data: document });
});

exports.getDocumentsByEntity = asyncHandler(async (req, res) => {
  const { entityType, entityId } = req.params;
  if (!allowedEntityTypes.includes(entityType)) return res.status(400).json({ success: false, message: 'entityType est invalide' });
  if (!mongoose.Types.ObjectId.isValid(entityId)) return res.status(400).json({ success: false, message: 'entityId est invalide' });
  const documents = await Document.find({ entityType, entityId }).sort({ createdAt: -1 });
  res.json({ success: true, count: documents.length, data: documents });
});

exports.updateDocument = asyncHandler(async (req, res) => {
  const document = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!document) return res.status(404).json({ success: false, message: 'Document introuvable' });
  res.json({ success: true, data: document });
});

exports.updateDocumentStatus = asyncHandler(async (req, res) => {
  const { status, rejectionReason = '' } = req.body;
  if (!allowedStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Statut document invalide' });
  if (status === 'REJECTED' && !rejectionReason.trim()) return res.status(400).json({ success: false, message: 'La raison de rejet est obligatoire' });
  const update = { status, rejectionReason: status === 'REJECTED' ? rejectionReason : '', verifiedAt: status === 'VERIFIED' ? new Date() : undefined };
  const document = await Document.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!document) return res.status(404).json({ success: false, message: 'Document introuvable' });
  res.json({ success: true, data: document });
});

exports.deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findByIdAndDelete(req.params.id);
  if (!document) return res.status(404).json({ success: false, message: 'Document introuvable' });
  res.json({ success: true, data: document });
});
