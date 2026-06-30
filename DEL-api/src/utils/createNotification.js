const Notification = require('../models/Notification');

async function createNotification(payload) {
  try {
    if (!payload?.title || !payload?.message) return null;
    return await Notification.create({
      recipientUserId: payload.recipientUserId || null,
      recipientRole: payload.recipientRole || 'SYSTEM',
      recipientName: payload.recipientName,
      title: payload.title,
      message: payload.message,
      type: payload.type || 'SYSTEM',
      relatedEntityType: payload.relatedEntityType || 'SYSTEM',
      relatedEntityId: payload.relatedEntityId || null,
      actionUrl: payload.actionUrl,
      priority: payload.priority || 'NORMAL',
    });
  } catch (error) {
    console.error('Notification creation failed:', error.message);
    return null;
  }
}

module.exports = createNotification;

async function notifyStakeholders({ request, equipment = [], title, message, type, relatedEntityType, relatedEntityId, actionUrl, priority = 'NORMAL' }) {
  const tasks = [];
  if (request?.companyUserId) tasks.push(createNotification({ recipientUserId: request.companyUserId, recipientRole: 'COMPANY', recipientName: request.companyName, title, message, type, relatedEntityType, relatedEntityId, actionUrl, priority }));
  const seen = new Set();
  equipment.filter((e) => e.ownerUserId).forEach((e) => { const id = String(e.ownerUserId); if (seen.has(id)) return; seen.add(id); tasks.push(createNotification({ recipientUserId: e.ownerUserId, recipientRole: 'OWNER', recipientName: e.ownerName, title, message, type, relatedEntityType, relatedEntityId, actionUrl, priority })); });
  return Promise.all(tasks);
}
module.exports.notifyStakeholders = notifyStakeholders;
