const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentNumber: { type: String, required: true, unique: true, trim: true },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
  companyName: { type: String, trim: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, enum: ['XOF', 'USD', 'EUR'], default: 'XOF' },
  method: { type: String, enum: ['CASH', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CHEQUE', 'CRYPTO', 'OTHER'], default: 'BANK_TRANSFER' },
  paymentDate: Date,
  reference: { type: String, trim: true },
  proofUrl: { type: String, trim: true },
  notes: { type: String, trim: true },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED'], default: 'CONFIRMED' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
