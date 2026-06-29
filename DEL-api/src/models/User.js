const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
  phone: { type: String, trim: true },
  role: { type: String, enum: ['OWNER', 'COMPANY', 'INVESTOR', 'TECHNICIAN', 'ADMIN'], required: true },
  accountType: { type: String, enum: ['INDIVIDUAL', 'COMPANY'], default: 'INDIVIDUAL' },
  status: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'], default: 'PENDING' },
  country: { type: String, trim: true },
  city: { type: String, trim: true },
  address: { type: String, trim: true },
  avatarUrl: { type: String, trim: true },
  preferredLanguage: { type: String, enum: ['fr', 'en'], default: 'fr' },
  notes: { type: String, trim: true },
  rejectionReason: { type: String, trim: true },
  verifiedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
