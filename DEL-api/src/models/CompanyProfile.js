const mongoose = require('mongoose');
const companyProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  companyName: { type: String, required: true, trim: true }, companyType: { type: String, enum: ['MINE', 'BTP', 'LOGISTICS', 'AGRICULTURE', 'ENERGY', 'TRANSPORT', 'OTHER'], required: true },
  contactName: { type: String, required: true, trim: true }, contactRole: { type: String, trim: true }, phone: { type: String, required: true, trim: true }, email: { type: String, trim: true, lowercase: true },
  country: { type: String, required: true, trim: true }, city: { type: String, required: true, trim: true }, address: { type: String, trim: true },
  rccm: { type: String, trim: true }, ifu: { type: String, trim: true }, businessLicenseNumber: { type: String, trim: true }, website: { type: String, trim: true },
  expectedMonthlyBudget: { type: Number, default: 0 }, preferredEquipmentTypes: [{ type: String, trim: true }],
  status: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'], default: 'PENDING' }, rejectionReason: { type: String, trim: true }, verifiedAt: { type: Date }, notes: { type: String, trim: true },
}, { timestamps: true });
module.exports = mongoose.model('CompanyProfile', companyProfileSchema);
