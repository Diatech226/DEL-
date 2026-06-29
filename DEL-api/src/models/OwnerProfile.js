const mongoose = require('mongoose');
const statuses = ['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'];
const ownerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  ownerType: { type: String, enum: ['INDIVIDUAL', 'COMPANY'], default: 'INDIVIDUAL' },
  fullName: { type: String, trim: true }, companyName: { type: String, trim: true }, phone: { type: String, required: true, trim: true }, email: { type: String, trim: true, lowercase: true },
  country: { type: String, required: true, trim: true }, city: { type: String, required: true, trim: true }, address: { type: String, trim: true },
  idDocumentType: { type: String, enum: ['CNIB', 'PASSPORT', 'DRIVER_LICENSE', 'RCCM', 'OTHER'] }, idDocumentNumber: { type: String, trim: true }, taxNumber: { type: String, trim: true },
  bankName: { type: String, trim: true }, bankAccountName: { type: String, trim: true }, bankAccountNumber: { type: String, trim: true }, mobileMoneyNumber: { type: String, trim: true },
  preferredPayoutMethod: { type: String, enum: ['BANK_TRANSFER', 'MOBILE_MONEY', 'CASH', 'OTHER'], default: 'MOBILE_MONEY' },
  totalEquipmentCount: { type: Number, default: 0 }, verifiedEquipmentCount: { type: Number, default: 0 }, status: { type: String, enum: statuses, default: 'PENDING' },
  rejectionReason: { type: String, trim: true }, verifiedAt: { type: Date }, notes: { type: String, trim: true },
}, { timestamps: true });
module.exports = mongoose.model('OwnerProfile', ownerProfileSchema);
