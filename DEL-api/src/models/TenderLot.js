const mongoose = require('mongoose');

const tenderLotSchema = new mongoose.Schema({
  tenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true, index: true },
  lotNumber: { type: Number, required: true },
  title: { type: String, trim: true },
  equipmentCategory: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  requiredCondition: { type: String, enum: ['NEW', 'GOOD', 'AVERAGE', 'ANY'], default: 'ANY' },
  country: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  workSiteLocation: { type: String, trim: true },
  startDate: Date,
  endDate: Date,
  durationMonths: Number,
  proposedPrice: Number,
  currency: { type: String, enum: ['XOF', 'USD', 'EUR'], default: 'XOF' },
  priceUnit: { type: String, enum: ['DAY', 'MONTH', 'PROJECT'], default: 'MONTH' },
  driverRequired: { type: Boolean, default: false },
  fuelIncluded: { type: Boolean, default: false },
  maintenanceIncluded: { type: Boolean, default: false },
  insuranceRequired: { type: Boolean, default: false },
  technicalRequirements: { type: String, trim: true },
  description: { type: String, trim: true },
  status: { type: String, enum: ['OPEN', 'MATCHING', 'PROPOSAL_SENT', 'NEGOTIATION', 'CONTRACT_PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'], default: 'OPEN' },
}, { timestamps: true });

tenderLotSchema.index({ tenderId: 1, lotNumber: 1 }, { unique: true });
module.exports = mongoose.model('TenderLot', tenderLotSchema);
