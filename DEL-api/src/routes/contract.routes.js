const router = require('express').Router({ mergeParams: true });
const { requireAdmin } = require('../middlewares/auth.middleware');
const c = require('../controllers/contract.controller');
router.post('/proposals/:id/contracts', c.createContractFromProposal);
router.route('/contracts').get(c.getContracts);
router.patch('/contracts/:id/status', requireAdmin, c.updateContractStatus);
router.route('/contracts/:id').get(c.getContractById).patch(c.updateContract).delete(c.deleteContract);
module.exports = router;
