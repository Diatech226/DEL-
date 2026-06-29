const mongoose = require('mongoose');
const technicianProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  fullName: { type: String, trim: true }, companyName: { type: String, trim: true }, technicianType: { type: String, enum: ['INDIVIDUAL', 'WORKSHOP', 'COMPANY'], default: 'INDIVIDUAL' },
  specialties: [{ type: String, enum: ['MECHANIC', 'ELECTRICITY', 'HYDRAULIC', 'WELDING', 'TIRES', 'ENGINE', 'BODYWORK', 'OTHER'] }], phone: { type: String, required: true, trim: true }, email: { type: String, trim: true, lowercase: true },
  country: { type: String, required: true, trim: true }, city: { type: String, required: true, trim: true }, address: { type: String, trim: true }, serviceAreas: [{ type: String, trim: true }], hourlyRate: { type: Number, default: 0 }, currency: { type: String, enum: ['XOF', 'USD', 'EUR'], default: 'XOF' },
  status: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'], default: 'PENDING' }, rejectionReason: { type: String, trim: true }, verifiedAt: { type: Date }, notes: { type: String, trim: true },
}, { timestamps: true });
module.exports = mongoose.model('TechnicianProfile', technicianProfileSchema);
