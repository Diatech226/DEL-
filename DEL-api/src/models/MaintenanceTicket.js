const mongoose = require('mongoose');

const issueTypes = ['BREAKDOWN', 'PREVENTIVE', 'CORRECTIVE', 'INSPECTION', 'ACCIDENT', 'OTHER'];
const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const statuses = ['OPEN', 'DIAGNOSIS', 'QUOTATION_PENDING', 'APPROVED', 'IN_REPAIR', 'COMPLETED', 'CANCELLED', 'REJECTED'];
const currencies = ['XOF', 'USD', 'EUR'];

const partSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  quantity: { type: Number, default: 1, min: 0 },
  unitCost: { type: Number, default: 0, min: 0 },
  totalCost: { type: Number, default: 0, min: 0 },
}, { _id: false });

const maintenanceTicketSchema = new mongoose.Schema({
  ticketNumber: { type: String, required: true, unique: true, index: true, trim: true },
  equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true, index: true },
  missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', index: true },
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', index: true },
  missionReportId: { type: mongoose.Schema.Types.ObjectId, ref: 'MissionReport', index: true },
  companyName: { type: String, trim: true },
  ownerName: { type: String, trim: true },
  equipmentTitle: { type: String, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  issueType: { type: String, enum: issueTypes, required: true, index: true },
  severity: { type: String, enum: severities, required: true, index: true },
  reportedBy: { type: String, trim: true },
  reportedAt: { type: Date, default: Date.now },
  locationText: { type: String, trim: true },
  technicianName: { type: String, trim: true },
  workshopName: { type: String, trim: true },
  diagnosis: { type: String, trim: true },
  estimatedCost: { type: Number, default: 0, min: 0 },
  finalCost: { type: Number, default: 0, min: 0 },
  currency: { type: String, enum: currencies, default: 'XOF' },
  estimatedDowntimeHours: { type: Number, default: 0, min: 0 },
  actualDowntimeHours: { type: Number, default: 0, min: 0 },
  parts: { type: [partSchema], default: [] },
  quotationUrl: { type: String, trim: true },
  invoiceUrl: { type: String, trim: true },
  photos: [{ type: String, trim: true }],
  documents: [{ type: String, trim: true }],
  repairStartDate: Date,
  repairEndDate: Date,
  status: { type: String, enum: statuses, default: 'OPEN', index: true },
}, { timestamps: true });

maintenanceTicketSchema.pre('validate', function calculatePartTotals(next) {
  if (Array.isArray(this.parts)) {
    this.parts = this.parts.map((part) => ({
      ...part,
      totalCost: Number(part.quantity || 0) * Number(part.unitCost || 0),
    }));
  }
  next();
});

module.exports = mongoose.model('MaintenanceTicket', maintenanceTicketSchema);
module.exports.issueTypes = issueTypes;
module.exports.severities = severities;
module.exports.statuses = statuses;
