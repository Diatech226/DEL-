const router = require('express').Router();
const { requireAdmin } = require('../middlewares/auth.middleware');
const c = require('../controllers/user.controller');
router.route('/').post(c.createUser).get(c.getUsers);
router.patch('/:id/status', requireAdmin, c.updateUserStatus);
router.route('/:id').get(c.getUserById).patch(c.updateUser).delete(c.deleteUser);
module.exports = router;
