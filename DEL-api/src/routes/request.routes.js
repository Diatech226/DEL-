const router = require('express').Router();
const c = require('../controllers/request.controller');
router.route('/').post(c.createRequest).get(c.getRequests);
router.route('/:id').get(c.getRequestById).patch(c.updateRequest).delete(c.deleteRequest);
module.exports = router;
