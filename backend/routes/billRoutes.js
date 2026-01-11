const express = require('express');
const router = express.Router();

const { 
  getBills, 
  generateAllMonthlyBills, 
  getBillById, 
  payBill      
} = require('../controllers/billController');

// Route lấy danh sách
router.route('/').get(getBills);

// Route tạo hóa đơn
router.route('/generate').post(generateAllMonthlyBills);

// Route chi tiết và thanh toán ---
router.route('/:id').get(getBillById);
router.route('/:id/pay').put(payBill);

module.exports = router;