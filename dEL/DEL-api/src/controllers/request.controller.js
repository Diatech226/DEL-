const EquipmentRequest = require('../models/EquipmentRequest');
const asyncHandler = require('../utils/asyncHandler');

exports.createRequest = asyncHandler(async (req, res) => {
  const request = await EquipmentRequest.create(req.body);
  res.status(201).json(request);
});
exports.listRequests = asyncHandler(async (req, res) => {
  const requests = await EquipmentRequest.find().sort({ createdAt: -1 });
  res.json(requests);
});
exports.getRequest = asyncHandler(async (req, res) => {
  const request = await EquipmentRequest.findById(req.params.id);
  if (!request) { res.status(404); throw new Error('Request not found'); }
  res.json(request);
});
exports.updateRequest = asyncHandler(async (req, res) => {
  const request = await EquipmentRequest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!request) { res.status(404); throw new Error('Request not found'); }
  res.json(request);
});
