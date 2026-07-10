const router = require('express').Router();
const { requireAdmin, optionalAnyAuth } = require('../middlewares/auth.middleware');
const c = require('../controllers/request.controller');
router.route('/').post(optionalAnyAuth, c.createRequest).get(c.getRequests);
router.get('/:id/matches', c.getRequestMatches);
router.post('/:id/proposals', requireAdmin, c.createProposalFromRequest);
router.patch('/:id/status', requireAdmin, c.updateRequestStatus);
router.route('/:id').get(c.getRequestById).patch(c.updateRequest).delete(c.deleteRequest);
module.exports = router;
