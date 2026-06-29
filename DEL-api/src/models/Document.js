const mongoose = require('mongoose');

const entityTypes = ['EQUIPMENT', 'COMPANY', 'OWNER', 'REQUEST', 'CONTRACT'];
const statuses = ['PENDING', 'VERIFIED', 'REJECTED'];

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  entityType: { type: String, enum: entityTypes, required: true, index: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  ownerName: { type: String, trim: true },
  uploadedBy: { type: String, trim: true },
  fileUrl: { type: String, required: true, trim: true },
  fileName: { type: String, trim: true },
  mimeType: { type: String, trim: true },
  notes: { type: String, trim: true },
  status: { type: String, enum: statuses, default: 'PENDING', index: true },
  rejectionReason: { type: String, trim: true },
  verifiedAt: { type: Date },
}, { timestamps: true });

documentSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

module.exports = mongoose.model('Document', documentSchema);
