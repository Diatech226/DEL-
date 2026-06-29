const router = require('express').Router();
const c = require('../controllers/equipment.controller');
router.route('/').post(c.createEquipment).get(c.getEquipment);
router.route('/:id').get(c.getEquipmentById).patch(c.updateEquipment).delete(c.deleteEquipment);
module.exports = router;
