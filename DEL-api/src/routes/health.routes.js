const router = require('express').Router();

router.get('/', (req, res) => res.json({ success: true, status: 'ok', service: 'DEL-api' }));

module.exports = router;
