const router = require('express').Router({ mergeParams: true });
const c = require('../controllers/mission.controller');
router.post('/contracts/:id/missions', c.createMissionFromContract);
router.route('/missions').get(c.getMissions);
router.patch('/missions/:id/status', c.updateMissionStatus);
router.route('/missions/:id').get(c.getMissionById).patch(c.updateMission).delete(c.deleteMission);
module.exports = router;
