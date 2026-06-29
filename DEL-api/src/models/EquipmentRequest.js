const mongoose = require('mongoose');

const equipmentRequestSchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true }, contactName: { type: String, required: true, trim: true }, contactPhone: { type: String, required: true, trim: true }, title: { type: String, trim: true }, equipmentCategory: { type: String, required: true, trim: true }, quantity: { type: Number, required: true, min: 1 }, country: { type: String, trim: true }, city: { type: String, trim: true }, workSiteLocation: { type: String, trim: true }, startDate: Date, endDate: Date, durationMonths: Number, proposedPrice: Number, currency: { type: String, enum: ['XOF', 'USD', 'EUR'], default: 'XOF' }, priceUnit: { type: String, enum: ['DAY', 'MONTH', 'PROJECT'], default: 'MONTH' }, driverRequired: { type: Boolean, default: false }, fuelIncluded: { type: Boolean, default: false }, maintenanceIncluded: { type: Boolean, default: false }, insuranceRequired: { type: Boolean, default: false }, description: { type: String, trim: true }, status: { type: String, enum: ['OPEN', 'MATCHING', 'PROPOSAL_SENT', 'NEGOTIATION', 'CONTRACT_PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'], default: 'OPEN' },
}, { timestamps: true });

module.exports = mongoose.model('EquipmentRequest', equipmentRequestSchema);
