const router = require('express').Router();
const { requireAuth } = require('../middlewares/auth.middleware');
const Equipment = require('../models/Equipment');
const EquipmentRequest = require('../models/EquipmentRequest');
const Document = require('../models/Document');
const Proposal = require('../models/Proposal');
const Contract = require('../models/Contract');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const Mission = require('../models/Mission');
const MaintenanceTicket = require('../models/MaintenanceTicket');
const asyncHandler = require('../utils/asyncHandler');
const proposalController = require('../controllers/proposal.controller');

const myDocumentsQuery = (userId) => ({ uploadedByUserId: userId });
const list = (res, data) => res.json({ success: true, count: data.length, data });
const userNames = (user) => [user.fullName, user.email, user.phone].filter(Boolean);
const inNames = (field, user) => ({ [field]: { $in: userNames(user) } });

router.use(requireAuth);

async function getOwnerEquipmentIds(userId) {
  const equipment = await Equipment.find({ ownerUserId: userId }).select('_id');
  return equipment.map((item) => item._id);
}
async function getCompanyRequestIds(user) {
  const requests = await EquipmentRequest.find({ $or: [{ companyUserId: user._id }, { companyName: user.fullName }] }).select('_id');
  return requests.map((item) => item._id);
}
async function scopedProposals(user) {
  if (user.role === 'COMPANY') {
    const requestIds = await getCompanyRequestIds(user);
    return Proposal.find({ $or: [{ requestId: { $in: requestIds } }, { companyName: user.fullName }] }).sort({ createdAt: -1 });
  }
  if (user.role === 'OWNER') {
    const equipmentIds = await getOwnerEquipmentIds(user._id);
    return Proposal.find({ $or: [{ equipmentIds: { $in: equipmentIds } }, inNames('ownerNames', user)] }).sort({ createdAt: -1 });
  }
  return [];
}
async function scopedContracts(user) {
  if (user.role === 'COMPANY') {
    const requestIds = await getCompanyRequestIds(user);
    return Contract.find({ $or: [{ requestId: { $in: requestIds } }, { companyName: user.fullName }] }).sort({ createdAt: -1 });
  }
  if (user.role === 'OWNER') {
    const equipmentIds = await getOwnerEquipmentIds(user._id);
    return Contract.find({ $or: [{ equipmentIds: { $in: equipmentIds } }, inNames('ownerNames', user)] }).sort({ createdAt: -1 });
  }
  return [];
}
async function scopedInvoices(user) {
  if (user.role === 'COMPANY') {
    const requestIds = await getCompanyRequestIds(user);
    const contracts = await Contract.find({ $or: [{ requestId: { $in: requestIds } }, { companyName: user.fullName }] }).select('_id');
    return Invoice.find({ $or: [{ contractId: { $in: contracts.map((c) => c._id) } }, { requestId: { $in: requestIds } }, { companyName: user.fullName }] }).sort({ createdAt: -1 });
  }
  if (user.role === 'OWNER') {
    const equipmentIds = await getOwnerEquipmentIds(user._id);
    const contracts = await Contract.find({ $or: [{ equipmentIds: { $in: equipmentIds } }, inNames('ownerNames', user)] }).select('_id');
    return Invoice.find({ $or: [{ contractId: { $in: contracts.map((c) => c._id) } }, { equipmentIds: { $in: equipmentIds } }, inNames('ownerNames', user)] }).sort({ createdAt: -1 });
  }
  return [];
}
async function scopedPayments(user) {
  const invoices = await scopedInvoices(user);
  if (!invoices.length) return [];
  return Payment.find({ invoiceId: { $in: invoices.map((i) => i._id) } }).sort({ createdAt: -1 });
}
async function scopedMissions(user) {
  if (user.role === 'COMPANY') {
    const requestIds = await getCompanyRequestIds(user);
    const contracts = await Contract.find({ $or: [{ requestId: { $in: requestIds } }, { companyName: user.fullName }] }).select('_id');
    return Mission.find({ $or: [{ contractId: { $in: contracts.map((c) => c._id) } }, { requestId: { $in: requestIds } }, { companyName: user.fullName }] }).sort({ createdAt: -1 });
  }
  if (user.role === 'OWNER') {
    const equipmentIds = await getOwnerEquipmentIds(user._id);
    return Mission.find({ $or: [{ equipmentIds: { $in: equipmentIds } }, inNames('ownerNames', user)] }).sort({ createdAt: -1 });
  }
  return [];
}

router.get('/equipment', asyncHandler(async (req, res) => list(res, await Equipment.find({ ownerUserId: req.user._id }).sort({ createdAt: -1 }))));
router.get('/requests', asyncHandler(async (req, res) => list(res, await EquipmentRequest.find({ companyUserId: req.user._id }).sort({ createdAt: -1 }))));
router.get('/documents', asyncHandler(async (req, res) => list(res, await Document.find(myDocumentsQuery(req.user._id)).sort({ createdAt: -1 }))));
router.get('/proposals', asyncHandler(async (req, res) => list(res, await scopedProposals(req.user))));
router.get('/contracts', asyncHandler(async (req, res) => list(res, await scopedContracts(req.user))));
router.patch('/proposals/:id/company-decision', proposalController.submitMyCompanyDecision);
router.patch('/proposals/:id/owner-decision', proposalController.submitMyOwnerDecision);
router.get('/invoices', asyncHandler(async (req, res) => list(res, await scopedInvoices(req.user))));
router.get('/payments', asyncHandler(async (req, res) => list(res, await scopedPayments(req.user))));
router.get('/missions', asyncHandler(async (req, res) => list(res, await scopedMissions(req.user))));

router.get('/financial-summary', asyncHandler(async (req, res) => {
  const invoices = await scopedInvoices(req.user);
  const sum = (field) => invoices.reduce((total, item) => total + Number(item[field] || 0), 0);
  const data = req.user.role === 'OWNER'
    ? { grossRevenue: sum('totalAmount'), platformCommission: sum('platformCommissionAmount'), ownerRevenue: sum('ownerAmount'), confirmedPaid: sum('amountPaid'), pendingBalance: sum('balanceDue'), invoiceCount: invoices.length }
    : { totalInvoiced: sum('totalAmount'), totalPaid: sum('amountPaid'), balanceDue: sum('balanceDue'), invoiceCount: invoices.length, paidInvoiceCount: invoices.filter((i) => i.status === 'PAID').length, pendingInvoiceCount: invoices.filter((i) => !['PAID', 'CANCELLED'].includes(i.status)).length };
  res.json({ success: true, data });
}));

router.get('/operations-summary', asyncHandler(async (req, res) => {
  if (req.user.role === 'OWNER') {
    const equipment = await Equipment.find({ ownerUserId: req.user._id }).select('_id status');
    const equipmentIds = equipment.map((e) => e._id); const missions = await scopedMissions(req.user);
    const openMaintenanceTickets = await MaintenanceTicket.countDocuments({ equipmentId: { $in: equipmentIds }, status: { $nin: ['COMPLETED', 'CANCELLED', 'REJECTED'] } });
    return res.json({ success: true, data: { totalEquipment: equipment.length, availableEquipment: equipment.filter((e) => e.status === 'AVAILABLE').length, placedEquipment: equipment.filter((e) => e.status === 'PLACED').length, maintenanceEquipment: equipment.filter((e) => e.status === 'UNDER_MAINTENANCE').length, activeMissions: missions.filter((m) => ['PLANNED', 'IN_TRANSIT', 'ON_SITE', 'PAUSED'].includes(m.status)).length, completedMissions: missions.filter((m) => m.status === 'COMPLETED').length, openMaintenanceTickets } });
  }
  if (req.user.role === 'COMPANY') {
    const requests = await EquipmentRequest.find({ companyUserId: req.user._id }); const contracts = await scopedContracts(req.user); const missions = await scopedMissions(req.user); const invoices = await scopedInvoices(req.user);
    return res.json({ success: true, data: { totalRequests: requests.length, openRequests: requests.filter((r) => ['OPEN', 'MATCHING', 'PROPOSAL_SENT', 'NEGOTIATION'].includes(r.status)).length, activeContracts: contracts.filter((c) => c.status === 'ACTIVE').length, activeMissions: missions.filter((m) => ['PLANNED', 'IN_TRANSIT', 'ON_SITE', 'PAUSED'].includes(m.status)).length, completedMissions: missions.filter((m) => m.status === 'COMPLETED').length, pendingInvoices: invoices.filter((i) => !['PAID', 'CANCELLED'].includes(i.status)).length, balanceDue: invoices.reduce((t, i) => t + Number(i.balanceDue || 0), 0) } });
  }
  res.json({ success: true, data: {} });
}));

router.get('/summary', asyncHandler(async (req, res) => {
  const [equipment, requests, documents, pendingDocuments, verifiedDocuments, rejectedDocuments, proposals, contracts, invoices, payments, missions, maintenanceTickets] = await Promise.all([
    Equipment.countDocuments({ ownerUserId: req.user._id }), EquipmentRequest.countDocuments({ companyUserId: req.user._id }), Document.countDocuments(myDocumentsQuery(req.user._id)), Document.countDocuments({ ...myDocumentsQuery(req.user._id), status: 'PENDING' }), Document.countDocuments({ ...myDocumentsQuery(req.user._id), status: 'VERIFIED' }), Document.countDocuments({ ...myDocumentsQuery(req.user._id), status: 'REJECTED' }), scopedProposals(req.user).then((d) => d.length), scopedContracts(req.user).then((d) => d.length), scopedInvoices(req.user).then((d) => d.length), scopedPayments(req.user).then((d) => d.length), scopedMissions(req.user).then((d) => d.length), req.user.role === 'OWNER' ? getOwnerEquipmentIds(req.user._id).then((ids) => MaintenanceTicket.countDocuments({ equipmentId: { $in: ids } })) : 0,
  ]);
  res.json({ success: true, data: { user: req.user.toJSON(), counts: { equipment, requests, documents, pendingDocuments, verifiedDocuments, rejectedDocuments, proposals, contracts, invoices, payments, missions, maintenanceTickets } } });
}));

module.exports = router;
