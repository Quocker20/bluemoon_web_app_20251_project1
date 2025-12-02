// File: backend/routes/feeRoutes.js
const express = require('express');
const router = express.Router();
const {
  getFees,
  createFee,
  updateFee,
  deleteFee,
} = require('../controllers/feeController');
const { protect, admin } = require('../middleware/authMiddleware');

// Tất cả các routes này đều cần Login + Quyền Admin
router.route('/')
  .get(protect, admin, getFees)
  .post(protect, admin, createFee);

router.route('/:id')
  .put(protect, admin, updateFee)
  .delete(protect, admin, deleteFee);

module.exports = router;