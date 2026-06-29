const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  phone: { type: String, required: true, trim: true },
  role: { type: String, enum: ['OWNER', 'COMPANY', 'INVESTOR', 'TECHNICIAN', 'ADMIN'], default: 'OWNER' },
  status: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'], default: 'PENDING' },
  country: { type: String, trim: true },
  city: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
