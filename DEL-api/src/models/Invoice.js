const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true, trim: true },
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
  proposalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'EquipmentRequest' },
  equipmentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }],
  companyName: { type: String, trim: true },
  ownerNames: [{ type: String, trim: true }],
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  issueDate: Date,
  dueDate: Date,
  periodStart: Date,
  periodEnd: Date,
  subtotal: { type: Number, required: true, default: 0 },
  taxRate: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  platformCommissionRate: { type: Number, default: 0 },
  platformCommissionAmount: { type: Number, default: 0 },
  ownerAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true, default: 0 },
  amountPaid: { type: Number, default: 0 },
  balanceDue: { type: Number, default: 0 },
  currency: { type: String, enum: ['XOF', 'USD', 'EUR'], default: 'XOF' },
  paymentTerms: { type: String, trim: true },
  notes: { type: String, trim: true },
  status: { type: String, enum: ['DRAFT', 'SENT', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED'], default: 'DRAFT' },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
