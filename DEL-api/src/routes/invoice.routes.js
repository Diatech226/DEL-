const router = require('express').Router({ mergeParams: true });
const { requireAdmin } = require('../middlewares/auth.middleware');
const c = require('../controllers/invoice.controller');
router.post('/contracts/:id/invoices', c.createInvoiceFromContract);
router.route('/invoices').get(c.getInvoices);
router.patch('/invoices/:id/status', requireAdmin, c.updateInvoiceStatus);
router.route('/invoices/:id').get(c.getInvoiceById).patch(c.updateInvoice).delete(c.deleteInvoice);
module.exports = router;
