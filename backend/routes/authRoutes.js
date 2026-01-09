// File: backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route Đăng ký: Cần đăng nhập (protect) VÀ là Admin (admin) mới được tạo
router.post('/register', protect, admin, registerUser);

// Route Đăng nhập: Ai cũng vào được (Public)
router.post('/login', loginUser);

// (Tùy chọn) Route Đăng xuất: Xóa cookie
router.post('/logout', (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Đăng xuất thành công' });
});

module.exports = router;