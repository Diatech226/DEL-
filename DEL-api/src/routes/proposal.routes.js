const router = require('express').Router();
const { requireAdmin } = require('../middlewares/auth.middleware');
const c = require('../controllers/proposal.controller');
router.route('/').post(c.createProposal).get(c.getProposals);
router.patch('/:id/status', requireAdmin, c.updateProposalStatus);
router.patch('/:id/company-decision', requireAdmin, c.submitAdminCompanyDecision);
router.patch('/:id/owner-decisions/:index', requireAdmin, c.submitAdminOwnerDecision);
router.route('/:id').get(c.getProposalById).patch(c.updateProposal).delete(c.deleteProposal);
module.exports = router;
