const Equipment = require('../models/Equipment');
const EquipmentRequest = require('../models/EquipmentRequest');
const Tender = require('../models/Tender');
const TenderLot = require('../models/TenderLot');
const Proposal = require('../models/Proposal');
const Contract = require('../models/Contract');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const Mission = require('../models/Mission');
const MaintenanceTicket = require('../models/MaintenanceTicket');
const Document = require('../models/Document');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const PlatformSettings = require('../models/PlatformSettings');
const { convertToCsv } = require('../utils/exportCsv');
const { createAuditLog } = require('../utils/audit');

const today = () => new Date().toISOString().slice(0, 10);
const idOf = (v) => v?._id?.toString?.() || v?.id?.toString?.() || v?.toString?.() || '';
const withId = (item) => ({ id: idOf(item), ...item });
const safeLimit = (value, fallback = 5000) => Math.min(Math.max(parseInt(value, 10) || fallback, 1), 20000);
const join = (value) => Array.isArray(value) ? value.join(', ') : value;

function buildFilter(query = {}) {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.dateFrom || query.dateTo) {
    filter.createdAt = {};
    if (query.dateFrom) filter.createdAt.$gte = new Date(query.dateFrom);
    if (query.dateTo) filter.createdAt.$lte = new Date(`${query.dateTo}T23:59:59.999Z`);
  }
  return filter;
}

async function auditExport(req, resource, format, fullBackup = false) {
  await createAuditLog({
    req,
    action: 'EXPORT',
    module: fullBackup ? 'SYSTEM' : 'REPORT',
    entityType: 'EXPORT',
    entityLabel: resource,
    message: fullBackup ? 'Full backup JSON généré' : `Export ${format.toUpperCase()} ${resource} généré`,
    severity: fullBackup ? 'HIGH' : 'NORMAL',
  });
}

function sendDownload(res, resource, format, payload) {
  const filename = `DEL-${resource}-${today()}.${format}`;
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    return res.send(JSON.stringify(payload, null, 2));
  }
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  return res.send(`\uFEFF${payload}`);
}

async function findRows(Model, req, options = {}) {
  const rows = await Model.find(buildFilter(req.query)).select(options.select || '').sort({ createdAt: -1 }).limit(safeLimit(req.query.limit)).lean();
  return options.map ? Promise.all(rows.map(options.map)) : rows;
}

function createExporter({ resource, Model, columns, map, select }) {
  return async (req, res, next) => {
    try {
      const format = req.query.format === 'json' ? 'json' : 'csv';
      const rows = await findRows(Model, req, { map, select });
      await auditExport(req, resource, format);
      if (format === 'json') return sendDownload(res, resource, 'json', rows);
      return sendDownload(res, resource, 'csv', convertToCsv(rows.map(withId), columns));
    } catch (error) { return next(error); }
  };
}

const cols = (keys) => keys.map((key) => ({ key, label: key }));
const userSelect = '-passwordHash';

const exportEquipment = createExporter({ resource: 'equipment', Model: Equipment, columns: cols(['id','title','category','brand','model','year','ownerName','ownerPhone','country','city','status','condition','rentalPricePerMonth','salePrice','currency','scoreTotal','scoreLabel','createdAt']) });
const exportRequests = createExporter({ resource: 'requests', Model: EquipmentRequest, columns: cols(['id','companyName','contactName','contactPhone','equipmentCategory','quantity','country','city','proposedPrice','currency','durationMonths','status','createdAt']) });
const exportTenders = createExporter({ resource: 'tenders', Model: Tender, columns: cols(['id','title','companyName','contactName','contactPhone','projectType','country','city','estimatedBudget','currency','status','createdAt','lotsCount']), map: async (t) => ({ ...t, lotsCount: await TenderLot.countDocuments({ tenderId: t._id }) }) });
const exportProposals = createExporter({ resource: 'proposals', Model: Proposal, columns: cols(['id','title','companyName','ownerNames','finalPrice','currency','durationMonths','status','workflowStatus','requestId','tenderId','tenderLotId','createdAt']), map: (p) => ({ ...p, ownerNames: join(p.ownerNames) }) });
const exportContracts = createExporter({ resource: 'contracts', Model: Contract, columns: cols(['id','contractNumber','title','companyName','ownerNames','amount','platformCommissionRate','platformCommissionAmount','ownerAmount','currency','startDate','endDate','status','createdAt']), map: (c) => ({ ...c, ownerNames: join(c.ownerNames) }) });
const exportInvoices = createExporter({ resource: 'invoices', Model: Invoice, columns: cols(['id','invoiceNumber','title','companyName','subtotal','taxAmount','totalAmount','platformCommissionAmount','ownerAmount','amountPaid','balanceDue','currency','dueDate','status','createdAt']) });
const exportPayments = createExporter({ resource: 'payments', Model: Payment, columns: cols(['id','paymentNumber','invoiceId','contractId','companyName','amount','currency','method','paymentDate','reference','status','createdAt']) });
const exportMissions = createExporter({ resource: 'missions', Model: Mission, columns: cols(['id','missionNumber','title','companyName','missionType','country','city','siteName','totalDistanceKm','totalEngineHours','totalFuelLiters','status','createdAt']) });
const exportMaintenance = createExporter({ resource: 'maintenance', Model: MaintenanceTicket, columns: cols(['id','ticketNumber','title','equipmentTitle','ownerName','companyName','issueType','severity','estimatedCost','finalCost','currency','actualDowntimeHours','status','createdAt']) });
const exportDocuments = createExporter({ resource: 'documents', Model: Document, columns: cols(['id','title','type','entityType','entityId','ownerName','uploadedBy','status','rejectionReason','fileUrl','createdAt']) });
const exportUsers = createExporter({ resource: 'users', Model: User, select: userSelect, columns: cols(['id','fullName','email','phone','role','accountType','status','country','city','createdAt','lastLoginAt']) });
const exportAuditLogs = createExporter({ resource: 'audit-logs', Model: AuditLog, columns: cols(['id','actorName','actorRole','action','module','entityType','entityId','entityLabel','message','severity','createdAt']) });

async function exportFullBackupJson(req, res, next) {
  try {
    const limit = safeLimit(req.query.limit, 5000);
    const [equipment, requests, tenders, proposals, contracts, invoices, payments, missions, maintenance, documents, users, settings] = await Promise.all([
      Equipment.find().sort({ createdAt: -1 }).limit(limit).lean(), EquipmentRequest.find().sort({ createdAt: -1 }).limit(limit).lean(), Tender.find().sort({ createdAt: -1 }).limit(limit).lean(), Proposal.find().sort({ createdAt: -1 }).limit(limit).lean(), Contract.find().sort({ createdAt: -1 }).limit(limit).lean(), Invoice.find().sort({ createdAt: -1 }).limit(limit).lean(), Payment.find().sort({ createdAt: -1 }).limit(limit).lean(), Mission.find().sort({ createdAt: -1 }).limit(limit).lean(), MaintenanceTicket.find().sort({ createdAt: -1 }).limit(limit).lean(), Document.find().sort({ createdAt: -1 }).limit(limit).lean(), User.find().select(userSelect).sort({ createdAt: -1 }).limit(limit).lean(), PlatformSettings.find().sort({ updatedAt: -1 }).limit(limit).lean(),
    ]);
    await auditExport(req, 'full-backup', 'json', true);
    return sendDownload(res, 'full-backup', 'json', { generatedAt: new Date().toISOString(), platform: 'DEL', data: { equipment, requests, tenders, proposals, contracts, invoices, payments, missions, maintenance, documents, users, settings } });
  } catch (error) { return next(error); }
}

module.exports = { exportEquipment, exportRequests, exportTenders, exportProposals, exportContracts, exportInvoices, exportPayments, exportMissions, exportMaintenance, exportDocuments, exportUsers, exportAuditLogs, exportFullBackupJson };
