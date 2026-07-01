const express = require('express');
const { requireAdmin } = require('../middlewares/auth.middleware');
const controller = require('../controllers/export.controller');
const router = express.Router();

router.get('/equipment', requireAdmin, controller.exportEquipment);
router.get('/requests', requireAdmin, controller.exportRequests);
router.get('/tenders', requireAdmin, controller.exportTenders);
router.get('/proposals', requireAdmin, controller.exportProposals);
router.get('/contracts', requireAdmin, controller.exportContracts);
router.get('/invoices', requireAdmin, controller.exportInvoices);
router.get('/payments', requireAdmin, controller.exportPayments);
router.get('/missions', requireAdmin, controller.exportMissions);
router.get('/maintenance', requireAdmin, controller.exportMaintenance);
router.get('/documents', requireAdmin, controller.exportDocuments);
router.get('/users', requireAdmin, controller.exportUsers);
router.get('/audit-logs', requireAdmin, controller.exportAuditLogs);
router.get('/full-backup', requireAdmin, controller.exportFullBackupJson);

module.exports = router;
