// File: backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
// Import thêm hàm vnpayReturn
const { createPaymentUrl, vnpayIpn, vnpayReturn } = require('../controllers/paymentController');

// Tạo link thanh toán
router.post('/create_payment_url', createPaymentUrl);

// Nhận IPN từ VNPAY (Server thật)
router.get('/vnpay_ipn', vnpayIpn);

// Nhận Return từ Frontend (Localhost dùng cái này)
router.get('/vnpay_return', vnpayReturn);

module.exports = router;