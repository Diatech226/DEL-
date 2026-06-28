const mongoose = require('mongoose');

const equipmentRequestSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactEmail: { type: String, required: true },
  equipmentCategory: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  targetPrice: Number,
  duration: { type: String, required: true },
  location: { type: String, required: true },
  conditions: String,
  status: { type: String, enum: ['pending', 'validated', 'matched', 'closed', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('EquipmentRequest', equipmentRequestSchema);
