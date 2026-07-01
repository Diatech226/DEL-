const express = require('express');
const { requireAdmin } = require('../middlewares/auth.middleware');
const controller = require('../controllers/audit.controller');
const router = express.Router();

router.use(requireAdmin);
router.get('/', controller.getAuditLogs);
router.get('/entity/:entityType/:entityId', controller.getAuditLogsByEntity);
router.get('/:id', controller.getAuditLogById);
router.delete('/:id', controller.deleteAuditLog);

module.exports = router;
