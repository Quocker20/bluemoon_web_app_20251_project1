// File: backend/routes/billRoutes.js
const express = require('express');
const router = express.Router();

const { createMonthlyBill, getBills, payBill } = require('../controllers/billController');

// Tạm thời chưa bật middleware Auth để test cho nhanh
router.route('/')
  .post(createMonthlyBill)
  .get(getBills);

router.route('/:id/pay').put(payBill);

module.exports = router;