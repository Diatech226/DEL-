const router = require('express').Router();
const { requireAdmin } = require('../middlewares/auth.middleware');
const c = require('../controllers/payment.controller');
router.route('/payments').post(c.createPayment).get(c.getPayments);
router.get('/payments/invoice/:invoiceId', c.getPaymentsByInvoice);
router.patch('/payments/:id/status', requireAdmin, c.updatePaymentStatus);
router.route('/payments/:id').get(c.getPaymentById).patch(c.updatePayment).delete(c.deletePayment);
module.exports = router;
