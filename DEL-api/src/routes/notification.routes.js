const router = require('express').Router();
const meRouter = require('express').Router();
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');
const c = require('../controllers/notification.controller');

router.route('/').post(requireAdmin, c.createNotificationManual).get(requireAdmin, c.getNotifications);
router.route('/:id').get(requireAdmin, c.getNotificationById).delete(requireAdmin, c.deleteNotification);
meRouter.get('/', requireAuth, c.getMyNotifications);
meRouter.patch('/read-all', requireAuth, c.markAllMyNotificationsAsRead);
meRouter.patch('/:id/read', requireAuth, c.markNotificationAsRead);
module.exports = router;
module.exports.meRouter = meRouter;
