const router = require('express').Router();
const { requireAdmin } = require('../middlewares/auth.middleware');
const EquipmentRequest = require('../models/EquipmentRequest');
const Proposal = require('../models/Proposal');
const Contract = require('../models/Contract');
const Invoice = require('../models/Invoice');
const Mission = require('../models/Mission');
const Equipment = require('../models/Equipment');
const asyncHandler = require('../utils/asyncHandler');

const same = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
async function matchesCountFor(request) {
  if (!request) return 0;
  return Equipment.countDocuments({ category: request.equipmentCategory, status: 'AVAILABLE', ...(request.country ? { country: new RegExp(`^${request.country.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } : {}) });
}
const step = (label, status, date) => ({ label, status, ...(date ? { date } : {}) });
function buildTimeline(request, proposals, contracts, invoices, missions) {
  const latestProposal = proposals[0];
  const companyRejected = latestProposal?.workflowStatus === 'REJECTED_BY_COMPANY';
  const ownerRejected = latestProposal?.workflowStatus === 'REJECTED_BY_OWNER';
  const companyDone = latestProposal?.companyDecision?.status === 'ACCEPTED';
  const ownersDone = latestProposal?.ownerDecisions?.length && latestProposal.ownerDecisions.every((d) => d.status === 'ACCEPTED');
  return [
    step('Demande créée', 'done', request.createdAt),
    step('Matching', proposals.length ? 'done' : 'pending'),
    step('Proposition', proposals.length ? 'done' : 'pending', latestProposal?.createdAt),
    step('Validation entreprise', companyRejected ? 'rejected' : companyDone ? 'done' : proposals.length ? 'pending' : 'blocked', latestProposal?.companyDecision?.decidedAt),
    step('Validation propriétaires', ownerRejected ? 'rejected' : ownersDone ? 'done' : proposals.length ? 'pending' : 'blocked'),
    step('Contrat', contracts.length ? 'done' : latestProposal?.workflowStatus === 'READY_FOR_CONTRACT' ? 'pending' : 'blocked', contracts[0]?.createdAt),
    step('Facture', invoices.length ? 'done' : contracts.length ? 'pending' : 'blocked', invoices[0]?.createdAt),
    step('Mission', missions.length ? 'done' : contracts.length ? 'pending' : 'blocked', missions[0]?.createdAt),
  ];
}

router.get('/requests/:id', requireAdmin, asyncHandler(async (req, res) => {
  const request = await EquipmentRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ success: false, message: 'Demande introuvable' });
  const proposals = await Proposal.find({ requestId: request._id }).sort({ createdAt: -1 });
  const contracts = await Contract.find({ requestId: request._id }).sort({ createdAt: -1 });
  const invoices = await Invoice.find({ requestId: request._id }).sort({ createdAt: -1 });
  const missions = await Mission.find({ requestId: request._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: { request, matchesCount: await matchesCountFor(request), proposals, contracts, invoices, missions, timeline: buildTimeline(request, proposals, contracts, invoices, missions) } });
}));
module.exports = router;
