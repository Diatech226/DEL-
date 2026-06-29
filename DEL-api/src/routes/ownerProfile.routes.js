const router = require('express').Router();
const c = require('../controllers/ownerProfile.controller');
router.route('/').post(c.createOwnerProfile).get(c.getOwnerProfiles);
router.patch('/:id/status', c.updateOwnerProfileStatus);
router.route('/:id').get(c.getOwnerProfileById).patch(c.updateOwnerProfile).delete(c.deleteOwnerProfile);
module.exports = router;
