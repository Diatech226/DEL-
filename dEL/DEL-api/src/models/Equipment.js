const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  brand: String,
  model: String,
  year: Number,
  location: { type: String, required: true },
  availability: { type: String, enum: ['available', 'reserved', 'unavailable'], default: 'available' },
  transactionType: { type: String, enum: ['rental', 'sale', 'placement'], default: 'rental' },
  dailyRate: Number,
  salePrice: Number,
  description: String,
  conditions: String,
  ownerName: { type: String, required: true },
  ownerEmail: { type: String, required: true },
  status: { type: String, enum: ['pending', 'validated', 'rejected'], default: 'pending' },
  futureModules: { financingReady: { type: Boolean, default: false }, gpsReady: { type: Boolean, default: false }, maintenanceReady: { type: Boolean, default: false } },
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
