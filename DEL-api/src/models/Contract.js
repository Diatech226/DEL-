const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  proposalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal', required: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'EquipmentRequest', required: true },
  equipmentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }],
  companyName: { type: String, trim: true },
  ownerNames: [{ type: String, trim: true }],
  title: { type: String, required: true, trim: true },
  contractNumber: { type: String, required: true, unique: true, trim: true },
  startDate: Date,
  endDate: Date,
  durationMonths: Number,
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['XOF', 'USD', 'EUR'], default: 'XOF' },
  paymentTerms: { type: String, trim: true },
  platformCommissionRate: { type: Number, default: 0 },
  platformCommissionAmount: { type: Number, default: 0 },
  ownerAmount: { type: Number, default: 0 },
  conditions: { type: String, trim: true },
  responsibilities: { type: String, trim: true },
  status: { type: String, enum: ['DRAFT', 'PENDING_SIGNATURE', 'ACTIVE', 'COMPLETED', 'CANCELLED'], default: 'DRAFT' },
}, { timestamps: true });

module.exports = mongoose.model('Contract', contractSchema);
