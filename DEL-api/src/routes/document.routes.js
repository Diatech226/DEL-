const router = require('express').Router();
const { requireAdmin } = require('../middlewares/auth.middleware');
const c = require('../controllers/document.controller');

router.route('/').post(c.createDocument).get(c.getDocuments);
router.get('/entity/:entityType/:entityId', c.getDocumentsByEntity);
router.patch('/:id/status', requireAdmin, c.updateDocumentStatus);
router.route('/:id').get(c.getDocumentById).patch(c.updateDocument).delete(c.deleteDocument);

module.exports = router;
