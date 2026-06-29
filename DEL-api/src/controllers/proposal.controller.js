const { z } = require('zod');
const Proposal = require('../models/Proposal');
const asyncHandler = require('../utils/asyncHandler');

const proposalSchema = z.object({
  requestId: z.string().min(1, 'requestId est obligatoire'), equipmentIds: z.array(z.string()).optional(), companyName: z.string().optional(), ownerNames: z.array(z.string()).optional(),
  title: z.string().trim().min(1, 'title est obligatoire'), finalPrice: z.coerce.number({ invalid_type_error: 'finalPrice est obligatoire' }), currency: z.enum(['XOF','USD','EUR'], { required_error: 'currency est obligatoire' }),
  durationMonths: z.coerce.number().optional(), conditions: z.string().optional(), status: z.string().optional(),
}).passthrough();
const updateSchema = proposalSchema.partial();
const statusSchema = z.object({ status: z.enum(['DRAFT','SENT','ACCEPTED','REJECTED','EXPIRED']) });
exports.createProposal = asyncHandler(async (req, res) => { const data = proposalSchema.parse(req.body); const item = await Proposal.create(data); res.status(201).json({ success: true, data: item }); });
exports.getProposals = asyncHandler(async (req, res) => { const items = await Proposal.find().sort({ createdAt: -1 }); res.json({ success: true, count: items.length, data: items }); });
exports.getProposalById = asyncHandler(async (req, res) => { const item = await Proposal.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Proposition introuvable' }); res.json({ success: true, data: item }); });
exports.updateProposal = asyncHandler(async (req, res) => { const data = updateSchema.parse(req.body); const item = await Proposal.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Proposition introuvable' }); res.json({ success: true, data: item }); });
exports.updateProposalStatus = asyncHandler(async (req, res) => { const { status } = statusSchema.parse(req.body); const item = await Proposal.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Proposition introuvable' }); res.json({ success: true, data: item }); });
exports.deleteProposal = asyncHandler(async (req, res) => { const item = await Proposal.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Proposition introuvable' }); res.json({ success: true, data: item }); });
