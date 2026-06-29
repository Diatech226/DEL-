const router = require('express').Router();
const c = require('../controllers/proposal.controller');
router.route('/').post(c.createProposal).get(c.getProposals);
router.patch('/:id/status', c.updateProposalStatus);
router.route('/:id').get(c.getProposalById).patch(c.updateProposal).delete(c.deleteProposal);
module.exports = router;
