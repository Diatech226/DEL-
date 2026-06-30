const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
  companyUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyName: { type: String, required: true, trim: true },
  contactName: { type: String, required: true, trim: true },
  contactPhone: { type: String, required: true, trim: true },
  contactEmail: { type: String, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  projectType: { type: String, enum: ['MINE', 'BTP', 'LOGISTICS', 'AGRICULTURE', 'ENERGY', 'TRANSPORT', 'OTHER'], required: true },
  country: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  siteLocationText: { type: String, trim: true },
  startDate: Date,
  endDate: Date,
  durationMonths: Number,
  estimatedBudget: Number,
  currency: { type: String, enum: ['XOF', 'USD', 'EUR'], default: 'XOF' },
  paymentTerms: { type: String, trim: true },
  specialConditions: { type: String, trim: true },
  documents: [{ type: String }],
  status: { type: String, enum: ['DRAFT', 'OPEN', 'UNDER_REVIEW', 'MATCHING', 'PROPOSAL_SENT', 'NEGOTIATION', 'CONTRACT_PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'REJECTED'], default: 'OPEN' },
}, { timestamps: true });

module.exports = mongoose.model('Tender', tenderSchema);
