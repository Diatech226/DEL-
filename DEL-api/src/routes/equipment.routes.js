const router = require('express').Router();
const { requireAdmin, optionalAnyAuth } = require('../middlewares/auth.middleware');
const c = require('../controllers/equipment.controller');
router.route('/').post(optionalAnyAuth, c.createEquipment).get(c.getEquipment);
router.patch('/:id/status', requireAdmin, c.updateEquipmentStatus);
router.route('/:id').get(c.getEquipmentById).patch(c.updateEquipment).delete(c.deleteEquipment);
module.exports = router;
