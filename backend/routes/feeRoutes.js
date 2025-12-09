const express = require('express');
const router = express.Router();
const { 
  getFees, 
  createFee, 
  deleteFee,
  getFeeById, // Nhớ import cái này
  updateFee   // Nhớ import cái này
} = require('../controllers/feeController');

// Route gốc: /api/fees
router.route('/')
  .get(getFees)
  .post(createFee);

// Route có ID: /api/fees/:id
router.route('/:id')
  .get(getFeeById)  // Dùng cho trang Edit (lấy dữ liệu lên form)
  .put(updateFee)   // Dùng cho nút Lưu (cập nhật)
  .delete(deleteFee); // Dùng cho nút Xóa

module.exports = router;