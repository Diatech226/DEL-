const router = require('express').Router();
const c = require('../controllers/auth.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
router.post('/register', c.register);
router.post('/login', c.login);
router.get('/me', requireAuth, c.getMe);
router.patch('/me', requireAuth, c.updateMe);
router.post('/logout', requireAuth, c.logoutPlaceholder);
module.exports = router;
