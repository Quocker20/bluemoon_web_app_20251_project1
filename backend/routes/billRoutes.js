const express = require('express');
const router = express.Router();
// Import đủ 4 hàm
const { 
  getBills, 
  generateAllMonthlyBills, 
  getBillById, // Mới
  payBill      // Mới
} = require('../controllers/billController');

// Route lấy danh sách
router.route('/').get(getBills);

// Route tạo hóa đơn
router.route('/generate').post(generateAllMonthlyBills);

// --- [MỚI] Route chi tiết và thanh toán ---
router.route('/:id').get(getBillById);
router.route('/:id/pay').put(payBill);

module.exports = router;