const router = require('express').Router();
const c = require('../controllers/equipmentSchedule.controller');
router.post('/check-availability', c.checkEquipmentAvailability);
router.get('/equipment/:equipmentId/availability', c.getAvailabilityByEquipment);
router.get('/equipment/:equipmentId', c.getSchedulesByEquipment);
router.patch('/:id/status', c.updateEquipmentScheduleStatus);
router.route('/:id').get(c.getEquipmentScheduleById).patch(c.updateEquipmentSchedule).delete(c.deleteEquipmentSchedule);
router.route('/').post(c.createEquipmentSchedule).get(c.getEquipmentSchedules);
module.exports = router;
