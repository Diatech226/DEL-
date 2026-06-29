const router = require('express').Router({ mergeParams: true });
const c = require('../controllers/missionReport.controller');
router.route('/mission-reports').post(c.createMissionReport).get(c.getMissionReports);
router.get('/mission-reports/mission/:missionId', c.getMissionReportsByMission);
router.patch('/mission-reports/:id/status', c.updateMissionReportStatus);
router.route('/mission-reports/:id').get(c.getMissionReportById).patch(c.updateMissionReport).delete(c.deleteMissionReport);
module.exports = router;
