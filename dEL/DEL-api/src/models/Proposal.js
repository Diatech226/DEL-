const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'EquipmentRequest', required: true },
  equipment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }],
  title: { type: String, required: true },
  message: String,
  proposedPrice: Number,
  status: { type: String, enum: ['draft', 'sent', 'accepted', 'refused'], default: 'draft' },
  adminNotes: String,
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
