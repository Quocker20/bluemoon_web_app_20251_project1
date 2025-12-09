const express = require('express');
const router = express.Router();
const { getBills, generateAllMonthlyBills } = require('../controllers/billController');

// Route lấy danh sách
router.route('/').get(getBills);

// Route tạo hóa đơn
router.route('/generate').post(generateAllMonthlyBills);

module.exports = router;