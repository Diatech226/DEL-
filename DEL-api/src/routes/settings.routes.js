const router = require('express').Router();
const { requireAdmin } = require('../middlewares/auth.middleware');
const c = require('../controllers/settings.controller');
router.get('/public', c.getPublicSettings);
router.get('/admin', requireAdmin, c.getAdminSettings);
router.patch('/admin', requireAdmin, c.updateSettings);
router.post('/reset', requireAdmin, c.resetSettingsToDefault);
module.exports = router;
