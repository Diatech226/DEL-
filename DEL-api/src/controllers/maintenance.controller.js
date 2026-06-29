const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const MaintenanceTicket = require('../models/MaintenanceTicket');
const Equipment = require('../models/Equipment');
const Contract = require('../models/Contract');
const generateMaintenanceTicketNumber = require('../utils/generateMaintenanceTicketNumber');
const { addHours, createScheduleForEquipment, hasScheduleConflict, updateSchedulesStatus } = require('../utils/equipmentSchedule.service');

const statuses = MaintenanceTicket.statuses;
const maintenanceStatuses = ['DIAGNOSIS', 'QUOTATION_PENDING', 'APPROVED', 'IN_REPAIR'];
const updateFields = ['title','description','issueType','severity','locationText','technicianName','workshopName','diagnosis','estimatedCost','finalCost','currency','estimatedDowntimeHours','actualDowntimeHours','parts','quotationUrl','invoiceUrl','photos','documents','repairStartDate','repairEndDate','status'];

function requiredMessage(body) {
  for (const field of ['equipmentId', 'title', 'issueType', 'severity']) {
    if (!body[field]) return `Le champ ${field} est obligatoire`;
  }
  return '';
}

function normalizeParts(parts = []) {
  return parts.filter((part) => part && part.name).map((part) => {
    const quantity = Number(part.quantity || 0);
    const unitCost = Number(part.unitCost || 0);
    return { name: part.name, quantity, unitCost, totalCost: quantity * unitCost };
  });
}

async function isMissionActive(missionId) {
  if (!missionId) return false;
  if (mongoose.models.Mission) {
    const mission = await mongoose.models.Mission.findById(missionId);
    return Boolean(mission && !['COMPLETED', 'CANCELLED'].includes(mission.status));
  }
  return true;
}

async function restoreEquipmentStatus(ticket) {
  const status = await isMissionActive(ticket.missionId) ? 'PLACED' : 'AVAILABLE';
  await Equipment.findByIdAndUpdate(ticket.equipmentId, { status }, { runValidators: true });
}

async function uniqueTicketNumber() {
  for (let i = 0; i < 5; i += 1) {
    const ticketNumber = generateMaintenanceTicketNumber();
    const exists = await MaintenanceTicket.exists({ ticketNumber });
    if (!exists) return ticketNumber;
  }
  return generateMaintenanceTicketNumber(new Date(Date.now() + Math.floor(Math.random() * 1000)));
}

exports.createMaintenanceTicket = asyncHandler(async (req, res) => {
  const message = requiredMessage(req.body);
  if (message) return res.status(400).json({ success: false, message });

  const equipment = await Equipment.findById(req.body.equipmentId);
  if (!equipment) return res.status(404).json({ success: false, message: 'Engin introuvable' });

  let companyName = req.body.companyName;
  if (!companyName && req.body.contractId) {
    const contract = await Contract.findById(req.body.contractId);
    companyName = contract?.companyName;
  }

  const parts = normalizeParts(req.body.parts || []);
  const ticket = await MaintenanceTicket.create({
    ...req.body,
    ticketNumber: await uniqueTicketNumber(),
    equipmentTitle: equipment.title,
    ownerName: equipment.ownerName,
    companyName,
    parts,
    finalCost: req.body.finalCost ?? (parts.length ? parts.reduce((sum, part) => sum + part.totalCost, 0) : req.body.finalCost),
    status: 'OPEN',
  });

  if (['HIGH', 'CRITICAL'].includes(ticket.severity)) {
    await Equipment.findByIdAndUpdate(equipment._id, { status: 'UNDER_MAINTENANCE' }, { runValidators: true });
  }

  let warning = '';
  if (ticket.estimatedDowntimeHours || ticket.repairStartDate) {
    const start = ticket.repairStartDate || ticket.reportedAt || new Date();
    const end = ticket.repairEndDate || addHours(start, ticket.estimatedDowntimeHours || 24);
    const conflicts = await hasScheduleConflict(equipment._id, start, end);
    if (conflicts.some((c) => c.type === 'MISSION')) warning = 'Attention : maintenance créée pendant une mission active.';
    await createScheduleForEquipment(equipment, { type: 'MAINTENANCE', title: 'Maintenance / réparation', description: ticket.description, startDate: start, endDate: end, relatedEntityType: 'MAINTENANCE', relatedEntityId: ticket._id, createdBy: req.body.createdBy || 'DEL-api', notes: warning });
  }
  res.status(201).json({ success: true, data: ticket, warning });
});

exports.getMaintenanceTickets = asyncHandler(async (req, res) => {
  const items = await MaintenanceTicket.find().sort({ createdAt: -1 });
  res.json({ success: true, count: items.length, data: items });
});
exports.getMaintenanceTicketById = asyncHandler(async (req, res) => { const item = await MaintenanceTicket.findById(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Ticket maintenance introuvable' }); res.json({ success: true, data: item }); });
exports.getMaintenanceTicketsByEquipment = asyncHandler(async (req, res) => { const items = await MaintenanceTicket.find({ equipmentId: req.params.equipmentId }).sort({ createdAt: -1 }); res.json({ success: true, count: items.length, data: items }); });
exports.getMaintenanceTicketsByMission = asyncHandler(async (req, res) => { const items = await MaintenanceTicket.find({ missionId: req.params.missionId }).sort({ createdAt: -1 }); res.json({ success: true, count: items.length, data: items }); });

exports.updateMaintenanceTicket = asyncHandler(async (req, res) => {
  const data = {};
  updateFields.forEach((field) => { if (req.body[field] !== undefined) data[field] = req.body[field]; });
  if (data.parts) {
    data.parts = normalizeParts(data.parts);
    if (req.body.finalCost === undefined) data.finalCost = data.parts.reduce((sum, part) => sum + part.totalCost, 0);
  }
  const item = await MaintenanceTicket.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: 'Ticket maintenance introuvable' });
  if (maintenanceStatuses.includes(item.status)) await Equipment.findByIdAndUpdate(item.equipmentId, { status: 'UNDER_MAINTENANCE' }, { runValidators: true });
  if (item.status === 'COMPLETED') await restoreEquipmentStatus(item);
  res.json({ success: true, data: item });
});

exports.updateMaintenanceTicketStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!statuses.includes(status)) return res.status(400).json({ success: false, message: 'Statut maintenance invalide' });
  const update = { status };
  if (status === 'COMPLETED') update.repairEndDate = req.body.repairEndDate || new Date();
  const item = await MaintenanceTicket.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: 'Ticket maintenance introuvable' });
  if (maintenanceStatuses.includes(status)) await Equipment.findByIdAndUpdate(item.equipmentId, { status: 'UNDER_MAINTENANCE' }, { runValidators: true });
  if (status === 'COMPLETED') { await restoreEquipmentStatus(item); await updateSchedulesStatus('MAINTENANCE', item._id, 'MAINTENANCE', 'COMPLETED'); }
  if (['CANCELLED', 'REJECTED'].includes(status)) {
    await updateSchedulesStatus('MAINTENANCE', item._id, 'MAINTENANCE', 'CANCELLED');
    const equipment = await Equipment.findById(item.equipmentId);
    if (equipment?.status === 'UNDER_MAINTENANCE') await restoreEquipmentStatus(item);
  }
  res.json({ success: true, data: item });
});

exports.deleteMaintenanceTicket = asyncHandler(async (req, res) => { const item = await MaintenanceTicket.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: 'Ticket maintenance introuvable' }); res.json({ success: true, data: item }); });
