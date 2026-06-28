const Equipment = require('../models/Equipment');
const asyncHandler = require('../utils/asyncHandler');

exports.createEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.create(req.body);
  res.status(201).json(equipment);
});
exports.listEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.find().sort({ createdAt: -1 });
  res.json(equipment);
});
exports.getEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.findById(req.params.id);
  if (!equipment) { res.status(404); throw new Error('Equipment not found'); }
  res.json(equipment);
});
exports.updateEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!equipment) { res.status(404); throw new Error('Equipment not found'); }
  res.json(equipment);
});
