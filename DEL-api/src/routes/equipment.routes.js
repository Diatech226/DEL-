const router = require('express').Router();
const { requireAdmin, optionalAuth } = require('../middlewares/auth.middleware');
const c = require('../controllers/equipment.controller');
router.route('/').post(optionalAuth, c.createEquipment).get(c.getEquipment);
router.patch('/:id/status', requireAdmin, c.updateEquipmentStatus);
router.route('/:id').get(c.getEquipmentById).patch(c.updateEquipment).delete(c.deleteEquipment);
module.exports = router;
