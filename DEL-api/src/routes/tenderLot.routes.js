const router = require('express').Router();
const { requireAdmin } = require('../middlewares/auth.middleware');
const c = require('../controllers/tenderLot.controller');
router.get('/', c.getTenderLots);
router.get('/:id/matches', c.getTenderLotMatches);
router.post('/:id/proposals', c.createProposalFromTenderLot);
router.patch('/:id/status', requireAdmin, c.updateTenderLotStatus);
router.route('/:id').get(c.getTenderLotById).patch(c.updateTenderLot).delete(c.deleteTenderLot);
module.exports = router;
