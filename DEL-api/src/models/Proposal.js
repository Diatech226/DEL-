const mongoose = require('mongoose');

const decisionStatuses = ['PENDING', 'ACCEPTED', 'REJECTED'];

const companyDecisionSchema = new mongoose.Schema({
  status: { type: String, enum: decisionStatuses, default: 'PENDING' },
  decidedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  decidedAt: Date,
  rejectionReason: { type: String, trim: true },
  notes: { type: String, trim: true },
}, { _id: false });

const ownerDecisionSchema = new mongoose.Schema({
  ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  ownerName: { type: String, trim: true },
  equipmentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }],
  status: { type: String, enum: decisionStatuses, default: 'PENDING' },
  decidedAt: Date,
  rejectionReason: { type: String, trim: true },
  notes: { type: String, trim: true },
}, { _id: false });

const proposalSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'EquipmentRequest', required: true },
  equipmentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }],
  companyName: { type: String, trim: true },
  ownerNames: [{ type: String, trim: true }],
  title: { type: String, required: true, trim: true },
  finalPrice: { type: Number, required: true },
  currency: { type: String, enum: ['XOF', 'USD', 'EUR'], default: 'XOF' },
  durationMonths: Number,
  conditions: { type: String, trim: true },
  status: { type: String, enum: ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'], default: 'DRAFT' },
  workflowStatus: { type: String, enum: ['PENDING_COMPANY', 'PENDING_OWNERS', 'READY_FOR_CONTRACT', 'REJECTED_BY_COMPANY', 'REJECTED_BY_OWNER', 'CANCELLED', 'EXPIRED'], default: 'PENDING_COMPANY' },
  companyDecision: { type: companyDecisionSchema, default: () => ({ status: 'PENDING' }) },
  ownerDecisions: { type: [ownerDecisionSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
