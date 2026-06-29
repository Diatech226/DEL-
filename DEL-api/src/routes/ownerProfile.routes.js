const router = require('express').Router();
const { requireAdmin } = require('../middlewares/auth.middleware');
const c = require('../controllers/ownerProfile.controller');
router.route('/').post(c.createOwnerProfile).get(c.getOwnerProfiles);
router.patch('/:id/status', requireAdmin, c.updateOwnerProfileStatus);
router.route('/:id').get(c.getOwnerProfileById).patch(c.updateOwnerProfile).delete(c.deleteOwnerProfile);
module.exports = router;
