// File: backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createPaymentUrl, vnpayIpn } = require('../controllers/paymentController');

// API tạo link thanh toán (Được gọi từ Frontend khi bấm nút Thanh toán)
router.post('/create_payment_url', createPaymentUrl);

// API nhận thông báo từ VNPAY (Được gọi từ Server VNPAY)
router.get('/vnpay_ipn', vnpayIpn);

module.exports = router;