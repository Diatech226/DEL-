const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'EquipmentRequest', required: true },
  equipmentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }],
  companyName: { type: String, trim: true }, ownerNames: [{ type: String, trim: true }], title: { type: String, required: true, trim: true }, finalPrice: { type: Number, required: true }, currency: { type: String, enum: ['XOF', 'USD', 'EUR'], default: 'XOF' }, durationMonths: Number, conditions: { type: String, trim: true }, status: { type: String, enum: ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'], default: 'DRAFT' },
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
