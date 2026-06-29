const router = require('express').Router();
const c = require('../controllers/technicianProfile.controller');
router.route('/').post(c.createTechnicianProfile).get(c.getTechnicianProfiles);
router.patch('/:id/status', c.updateTechnicianProfileStatus);
router.route('/:id').get(c.getTechnicianProfileById).patch(c.updateTechnicianProfile).delete(c.deleteTechnicianProfile);
module.exports = router;
