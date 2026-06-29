const router = require('express').Router();
const c = require('../controllers/companyProfile.controller');
router.route('/').post(c.createCompanyProfile).get(c.getCompanyProfiles);
router.patch('/:id/status', c.updateCompanyProfileStatus);
router.route('/:id').get(c.getCompanyProfileById).patch(c.updateCompanyProfile).delete(c.deleteCompanyProfile);
module.exports = router;
