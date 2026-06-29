const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({
  forSale: { type: Boolean, default: false },
  forRent: { type: Boolean, default: false },
  minePlacement: { type: Boolean, default: false },
  btpPlacement: { type: Boolean, default: false },
  fullManagement: { type: Boolean, default: false },
  gpsTracking: { type: Boolean, default: false },
  cameraTracking: { type: Boolean, default: false },
  maintenanceIncluded: { type: Boolean, default: false },
  insuranceIncluded: { type: Boolean, default: false },
  driverIncluded: { type: Boolean, default: false },
}, { _id: false });

const equipmentSchema = new mongoose.Schema({
  ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ownerName: { type: String, required: true, trim: true }, ownerPhone: { type: String, required: true, trim: true }, title: { type: String, required: true, trim: true }, category: { type: String, required: true, trim: true }, brand: { type: String, trim: true }, model: { type: String, trim: true }, year: Number, serialNumber: { type: String, trim: true }, condition: { type: String, enum: ['NEW', 'GOOD', 'AVERAGE', 'NEEDS_REPAIR'], default: 'GOOD' }, engineHours: Number, country: { type: String, trim: true }, city: { type: String, trim: true }, locationText: { type: String, trim: true }, photos: [{ type: String }], documents: [{ type: String }], salePrice: Number, rentalPricePerDay: Number, rentalPricePerMonth: Number, currency: { type: String, enum: ['XOF', 'USD', 'EUR'], default: 'XOF' }, services: { type: servicesSchema, default: () => ({}) }, status: { type: String, enum: ['DRAFT', 'PENDING_REVIEW', 'AVAILABLE', 'RESERVED', 'PLACED', 'UNDER_MAINTENANCE', 'SOLD', 'REJECTED'], default: 'PENDING_REVIEW' },
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
