const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  missionNumber: { type: String, required: true, unique: true, trim: true },
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'EquipmentRequest' },
  equipmentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }],
  companyName: { type: String, trim: true },
  ownerNames: [{ type: String, trim: true }],
  title: { type: String, required: true, trim: true },
  missionType: { type: String, enum: ['MINE', 'BTP', 'LOGISTICS', 'AGRICULTURE', 'ENERGY', 'OTHER'], default: 'OTHER' },
  country: { type: String, trim: true },
  city: { type: String, trim: true },
  siteName: { type: String, trim: true },
  siteLocationText: { type: String, trim: true },
  siteContactName: { type: String, trim: true },
  siteContactPhone: { type: String, trim: true },
  plannedStartDate: Date,
  plannedEndDate: Date,
  actualStartDate: Date,
  actualEndDate: Date,
  departureDate: Date,
  arrivalDate: Date,
  totalDistanceKm: { type: Number, default: 0 },
  totalEngineHours: { type: Number, default: 0 },
  totalFuelLiters: { type: Number, default: 0 },
  notes: { type: String, trim: true },
  status: { type: String, enum: ['PLANNED', 'IN_TRANSIT', 'ON_SITE', 'PAUSED', 'COMPLETED', 'CANCELLED'], default: 'PLANNED' },
}, { timestamps: true });

module.exports = mongoose.model('Mission', missionSchema);
