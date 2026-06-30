const router = require('express').Router();
const { requireAuth } = require('../middlewares/auth.middleware');
const Equipment = require('../models/Equipment');
const EquipmentRequest = require('../models/EquipmentRequest');
const Document = require('../models/Document');
const asyncHandler = require('../utils/asyncHandler');

const myDocumentsQuery = (userId) => ({ uploadedByUserId: userId });

router.use(requireAuth);

router.get('/equipment', asyncHandler(async (req, res) => {
  const data = await Equipment.find({ ownerUserId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: data.length, data });
}));

router.get('/requests', asyncHandler(async (req, res) => {
  const data = await EquipmentRequest.find({ companyUserId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: data.length, data });
}));

router.get('/documents', asyncHandler(async (req, res) => {
  const data = await Document.find(myDocumentsQuery(req.user._id)).sort({ createdAt: -1 });
  res.json({ success: true, count: data.length, data });
}));

router.get('/summary', asyncHandler(async (req, res) => {
  const [equipment, requests, documents, pendingDocuments, verifiedDocuments, rejectedDocuments] = await Promise.all([
    Equipment.countDocuments({ ownerUserId: req.user._id }),
    EquipmentRequest.countDocuments({ companyUserId: req.user._id }),
    Document.countDocuments(myDocumentsQuery(req.user._id)),
    Document.countDocuments({ ...myDocumentsQuery(req.user._id), status: 'PENDING' }),
    Document.countDocuments({ ...myDocumentsQuery(req.user._id), status: 'VERIFIED' }),
    Document.countDocuments({ ...myDocumentsQuery(req.user._id), status: 'REJECTED' }),
  ]);
  res.json({ success: true, data: { user: req.user.toJSON(), counts: { equipment, requests, documents, pendingDocuments, verifiedDocuments, rejectedDocuments } } });
}));

module.exports = router;
