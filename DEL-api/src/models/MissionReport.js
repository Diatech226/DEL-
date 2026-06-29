const mongoose = require('mongoose');

const missionReportSchema = new mongoose.Schema({
  missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
  reportDate: { type: Date, required: true },
  equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
  reporterName: { type: String, trim: true },
  reportType: { type: String, enum: ['DAILY', 'INCIDENT', 'FUEL', 'MAINTENANCE', 'CHECKIN', 'CHECKOUT', 'OTHER'], default: 'DAILY' },
  workDescription: { type: String, trim: true },
  engineHoursStart: { type: Number, default: 0 },
  engineHoursEnd: { type: Number, default: 0 },
  distanceKm: { type: Number, default: 0 },
  fuelLiters: { type: Number, default: 0 },
  locationText: { type: String, trim: true },
  equipmentCondition: { type: String, enum: ['EXCELLENT', 'GOOD', 'AVERAGE', 'NEEDS_REPAIR', 'OUT_OF_SERVICE'], default: 'GOOD' },
  incidentOccurred: { type: Boolean, default: false },
  incidentDescription: { type: String, trim: true },
  photos: [{ type: String, trim: true }],
  documentUrls: [{ type: String, trim: true }],
  notes: { type: String, trim: true },
  status: { type: String, enum: ['DRAFT', 'SUBMITTED', 'REVIEWED', 'REJECTED'], default: 'SUBMITTED' },
}, { timestamps: true });

module.exports = mongoose.model('MissionReport', missionReportSchema);
