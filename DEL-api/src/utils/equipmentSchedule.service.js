const Equipment = require('../models/Equipment');
const EquipmentSchedule = require('../models/EquipmentSchedule');

function addMonths(date, months = 1) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + Number(months || 1));
  return d;
}
function addHours(date, hours = 24) { return new Date(new Date(date).getTime() + Number(hours || 24) * 60 * 60 * 1000); }
function normalizePeriod(startDate, endDate, durationMonths) {
  const start = startDate ? new Date(startDate) : new Date();
  const end = endDate ? new Date(endDate) : addMonths(start, durationMonths || 1);
  return { start, end };
}
async function hasScheduleConflict(equipmentId, startDate, endDate, excludeScheduleId) {
  const query = { equipmentId, status: 'ACTIVE', type: { $ne: 'AVAILABLE' }, startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } };
  if (excludeScheduleId) query._id = { $ne: excludeScheduleId };
  return EquipmentSchedule.find(query).sort({ startDate: 1 });
}
async function createScheduleForEquipment(equipmentOrId, payload) {
  const equipment = typeof equipmentOrId === 'object' && equipmentOrId.title ? equipmentOrId : await Equipment.findById(equipmentOrId);
  if (!equipment) throw new Error('Engin introuvable');
  return EquipmentSchedule.create({ ...payload, equipmentId: equipment._id, equipmentTitle: equipment.title, ownerName: equipment.ownerName, status: payload.status || 'ACTIVE' });
}
async function updateSchedulesStatus(relatedEntityType, relatedEntityId, type, status) {
  const query = { relatedEntityType, relatedEntityId };
  if (type) query.type = type;
  return EquipmentSchedule.updateMany(query, { status }, { runValidators: true });
}
module.exports = { addHours, addMonths, normalizePeriod, hasScheduleConflict, createScheduleForEquipment, updateSchedulesStatus };
