const router = require('express').Router();
const controller = require('../controllers/proposal.controller');
router.post('/', controller.createProposal);
router.get('/', controller.listProposals);
router.get('/:id', controller.getProposal);
router.patch('/:id', controller.updateProposal);
module.exports = router;
