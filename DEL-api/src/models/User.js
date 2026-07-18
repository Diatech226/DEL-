const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
  phone: { type: String, trim: true, unique: true, sparse: true },
  passwordHash: { type: String, select: false },
  clerkUserId: { type: String, unique: true, sparse: true },
  authProvider: { type: String, enum: ['LOCAL', 'CLERK'], default: 'LOCAL' },
  role: { type: String, enum: ['ADMIN', 'OWNER', 'COMPANY', 'INVESTOR', 'TECHNICIAN', 'USER'], required: true },
  accountType: { type: String, enum: ['ADMIN', 'INDIVIDUAL', 'COMPANY'], default: 'INDIVIDUAL' },
  status: { type: String, enum: ['ACTIVE', 'PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED', 'ARCHIVED'], default: 'PENDING' },
  mustChangePassword: { type: Boolean, default: false },
  country: { type: String, trim: true },
  city: { type: String, trim: true },
  address: { type: String, trim: true },
  avatarUrl: { type: String, trim: true },
  preferredLanguage: { type: String, enum: ['fr', 'en'], default: 'fr' },
  notes: { type: String, trim: true },
  lastLoginAt: { type: Date },
  rejectionReason: { type: String, trim: true },
  verifiedAt: { type: Date },
}, { timestamps: true });


userSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.password;
    delete ret.resetToken;
    delete ret.resetTokenExpires;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
