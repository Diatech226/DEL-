const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String, enum: ['owner', 'company', 'admin'], default: 'owner' },
  companyName: String,
  phone: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
