const router = require('express').Router();
const controller = require('../controllers/equipment.controller');
router.post('/', controller.createEquipment);
router.get('/', controller.listEquipment);
router.get('/:id', controller.getEquipment);
router.patch('/:id', controller.updateEquipment);
module.exports = router;
