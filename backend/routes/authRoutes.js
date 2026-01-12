const express = require('express');
const router = express.Router();
const { registerUser, loginUser, changePassword } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route Đăng ký (Chỉ Admin)
router.post('/register', protect, admin, registerUser);

// Route Đăng nhập (Public)
router.post('/login', loginUser);

// --- Route Đổi mật khẩu (Cần đăng nhập) ---
router.put('/profile/password', protect, changePassword);

// Route Đăng xuất
router.post('/logout', (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Đăng xuất thành công' });
});

module.exports = router;