const asyncHandler = require('../utils/asyncHandler');
const PlatformSettings = require('../models/PlatformSettings');
const { defaultSettings } = require('../utils/defaultSettings');
const { getOrCreateSettings, publicSettings } = require('../utils/settings.service');
const { createAuditLog } = require('../utils/audit');
function clean(payload) { const data = { ...payload }; delete data.key; delete data._id; delete data.createdAt; delete data.updatedAt; delete data.__v; return data; }
exports.getPublicSettings = asyncHandler(async (req, res) => { const settings = await getOrCreateSettings(); res.json({ success: true, data: publicSettings(settings) }); });
exports.getAdminSettings = asyncHandler(async (req, res) => { const settings = await getOrCreateSettings(); res.json({ success: true, data: settings }); });
exports.updateSettings = asyncHandler(async (req, res) => {
  const data = clean(req.body);
  if (req.user?._id) data.updatedBy = req.user._id;
  const current = await getOrCreateSettings();
  const oldValue = clean(current.toObject());
  Object.assign(current, data);
  await current.save();
  await createAuditLog({ req, action: 'SETTINGS_UPDATE', module: 'SETTINGS', entityType: 'SETTINGS', entityId: current._id, entityLabel: 'Paramètres plateforme', oldValue, newValue: clean(current.toObject()), message: 'Paramètres administrateur modifiés', severity: 'HIGH' });
  res.json({ success: true, data: current });
});
exports.resetSettingsToDefault = asyncHandler(async (req, res) => {
  const settings = await PlatformSettings.findOneAndUpdate(
    { key: 'default' },
    { ...defaultSettings, key: 'default', updatedBy: req.user?._id },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  await createAuditLog({ req, action: 'SETTINGS_UPDATE', module: 'SETTINGS', entityType: 'SETTINGS', entityId: settings._id, entityLabel: 'Paramètres plateforme', newValue: clean(settings.toObject()), message: 'Paramètres réinitialisés par défaut', severity: 'HIGH' });
  res.json({ success: true, data: settings });
});
