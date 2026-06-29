const router = require('express').Router();
const c = require('../controllers/maintenance.controller');

router.route('/').post(c.createMaintenanceTicket).get(c.getMaintenanceTickets);
router.get('/equipment/:equipmentId', c.getMaintenanceTicketsByEquipment);
router.get('/mission/:missionId', c.getMaintenanceTicketsByMission);
router.patch('/:id/status', c.updateMaintenanceTicketStatus);
router.route('/:id').get(c.getMaintenanceTicketById).patch(c.updateMaintenanceTicket).delete(c.deleteMaintenanceTicket);

module.exports = router;
