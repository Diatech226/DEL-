const mongoose = require('mongoose');

const equipmentScheduleSchema = new mongoose.Schema({
  equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true, index: true },
  equipmentTitle: { type: String, trim: true },
  ownerName: { type: String, trim: true },
  type: { type: String, enum: ['AVAILABLE', 'RESERVED', 'CONTRACT', 'MISSION', 'MAINTENANCE', 'UNAVAILABLE', 'BLOCKED'], required: true, default: 'BLOCKED', index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  startDate: { type: Date, required: true, index: true },
  endDate: { type: Date, required: true, index: true },
  relatedEntityType: { type: String, enum: ['PROPOSAL', 'CONTRACT', 'MISSION', 'MAINTENANCE', 'MANUAL', 'OTHER'], default: 'MANUAL', index: true },
  relatedEntityId: { type: mongoose.Schema.Types.ObjectId, index: true },
  status: { type: String, enum: ['ACTIVE', 'CANCELLED', 'COMPLETED'], default: 'ACTIVE', index: true },
  createdBy: { type: String, trim: true },
  notes: { type: String, trim: true },
}, { timestamps: true });

equipmentScheduleSchema.index({ equipmentId: 1, status: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('EquipmentSchedule', equipmentScheduleSchema);
