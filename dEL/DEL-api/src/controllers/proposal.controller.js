const Proposal = require('../models/Proposal');
const asyncHandler = require('../utils/asyncHandler');

exports.createProposal = asyncHandler(async (req, res) => {
  const proposal = await Proposal.create(req.body);
  res.status(201).json(proposal);
});
exports.listProposals = asyncHandler(async (req, res) => {
  const proposals = await Proposal.find().populate('request').populate('equipment').sort({ createdAt: -1 });
  res.json(proposals);
});
exports.getProposal = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findById(req.params.id).populate('request').populate('equipment');
  if (!proposal) { res.status(404); throw new Error('Proposal not found'); }
  res.json(proposal);
});
exports.updateProposal = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!proposal) { res.status(404); throw new Error('Proposal not found'); }
  res.json(proposal);
});
