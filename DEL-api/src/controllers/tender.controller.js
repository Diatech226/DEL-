const { z } = require('zod');
const Tender = require('../models/Tender');
const TenderLot = require('../models/TenderLot');
const asyncHandler = require('../utils/asyncHandler');

const statuses = ['DRAFT','OPEN','UNDER_REVIEW','MATCHING','PROPOSAL_SENT','NEGOTIATION','CONTRACT_PENDING','ACTIVE','COMPLETED','CANCELLED','REJECTED'];
const lotStatuses = ['OPEN','MATCHING','PROPOSAL_SENT','NEGOTIATION','CONTRACT_PENDING','ACTIVE','COMPLETED','CANCELLED'];
const tenderSchema = z.object({
  companyName: z.string().trim().min(1), contactName: z.string().trim().min(1), contactPhone: z.string().trim().min(1), contactEmail: z.string().optional(),
  title: z.string().trim().min(1), description: z.string().optional(), projectType: z.enum(['MINE','BTP','LOGISTICS','AGRICULTURE','ENERGY','TRANSPORT','OTHER']),
  country: z.string().trim().min(1), city: z.string().trim().min(1), siteLocationText: z.string().optional(), startDate: z.coerce.date().optional(), endDate: z.coerce.date().optional(), durationMonths: z.coerce.number().optional(), estimatedBudget: z.coerce.number().optional(), currency: z.enum(['XOF','USD','EUR']).optional(), paymentTerms: z.string().optional(), specialConditions: z.string().optional(), documents: z.array(z.string()).optional(), status: z.enum(statuses).optional(), lots: z.array(z.any()).optional(),
}).passthrough();
const lotSchema = z.object({ equipmentCategory: z.string().trim().min(1), quantity: z.coerce.number().min(1), country: z.string().optional(), city: z.string().optional(), status: z.enum(lotStatuses).optional() }).passthrough();
const statusSchema = z.object({ status: z.enum(statuses) });

exports.createTender = asyncHandler(async (req, res) => {
  const data = tenderSchema.parse(req.body);
  const lotsInput = Array.isArray(data.lots) ? data.lots : [];
  delete data.lots;
  if (req.user?.role === 'COMPANY') data.companyUserId = req.user._id;
  const tender = await Tender.create(data);
  const lots = [];
  for (const [index, raw] of lotsInput.entries()) {
    const lotData = lotSchema.parse({ country: data.country, city: data.city, currency: data.currency, startDate: data.startDate, endDate: data.endDate, durationMonths: data.durationMonths, ...raw });
    // eslint-disable-next-line no-await-in-loop
    lots.push(await TenderLot.create({ ...lotData, tenderId: tender._id, lotNumber: lotData.lotNumber || index + 1 }));
  }
  res.status(201).json({ success: true, data: { tender, lots } });
});
exports.getTenders = asyncHandler(async (_req, res) => { const data = await Tender.find().sort({ createdAt: -1 }); res.json({ success: true, count: data.length, data }); });
exports.getTenderById = asyncHandler(async (req, res) => { const tender = await Tender.findById(req.params.id); if (!tender) return res.status(404).json({ success: false, message: 'Appel d’offres introuvable' }); res.json({ success: true, data: tender }); });
exports.updateTender = asyncHandler(async (req, res) => { const data = tenderSchema.partial().parse(req.body); delete data.lots; const tender = await Tender.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }); if (!tender) return res.status(404).json({ success: false, message: 'Appel d’offres introuvable' }); res.json({ success: true, data: tender }); });
exports.updateTenderStatus = asyncHandler(async (req, res) => { const { status } = statusSchema.parse(req.body); const tender = await Tender.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }); if (!tender) return res.status(404).json({ success: false, message: 'Appel d’offres introuvable' }); res.json({ success: true, data: tender }); });
exports.deleteTender = asyncHandler(async (req, res) => { const tender = await Tender.findByIdAndDelete(req.params.id); if (!tender) return res.status(404).json({ success: false, message: 'Appel d’offres introuvable' }); await TenderLot.deleteMany({ tenderId: tender._id }); res.json({ success: true, data: tender }); });
