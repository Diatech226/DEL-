const { z } = require('zod');
const Proposal = require('../models/Proposal');
const asyncHandler = require('../utils/asyncHandler');

const proposalSchema = z.object({ requestId: z.string().min(1), equipmentIds: z.array(z.string()).optional(), companyName: z.string().min(1), ownerNames: z.array(z.string()).optional(), title: z.string().min(1), finalPrice: z.coerce.number().optional(), currency: z.enum(['XOF','USD','EUR']).optional(), durationMonths: z.coerce.number().optional(), conditions: z.string().optional(), status: z.string().optional() });
const updateSchema = proposalSchema.partial();

exports.createProposal = asyncHandler(async (req, res) => { const data = proposalSchema.parse(req.body); const item = await Proposal.create(data); res.status(201).json({ success: true, data: item }); });
exports.getProposals = asyncHandler(async (req, res) => { const items = await Proposal.find().sort({ createdAt: -1 }); res.json({ success: true, count: items.length, data: items }); });
exports.getProposalById = asyncHandler(async (req, res) => { const item = await Proposal.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Proposal not found' }); res.json({ success: true, data: item }); });
exports.updateProposal = asyncHandler(async (req, res) => { const data = updateSchema.parse(req.body); const item = await Proposal.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }); if (!item) return res.status(404).json({ success: false, message: 'Proposal not found' }); res.json({ success: true, data: item }); });
exports.deleteProposal = asyncHandler(async (req, res) => { const item = await Proposal.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Proposal not found' }); res.json({ success: true, data: null }); });
