const router = require('express').Router();
const controller = require('../controllers/request.controller');
router.post('/', controller.createRequest);
router.get('/', controller.listRequests);
router.get('/:id', controller.getRequest);
router.patch('/:id', controller.updateRequest);
module.exports = router;
