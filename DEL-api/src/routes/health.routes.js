const router = require('express').Router();
router.get('/', (req, res) => res.json({ status: 'ok', service: 'DEL-api' }));
module.exports = router;
