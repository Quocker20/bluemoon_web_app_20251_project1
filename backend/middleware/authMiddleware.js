// File: backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// Middleware bảo vệ: Kiểm tra người dùng đã đăng nhập chưa
const protect = async (req, res, next) => {
  let token;

  // 1. Kiểm tra xem có Token trong cookie không
  // (Lưu ý: Frontend cần gửi token qua cookie hoặc header. Ở đây ta kiểm tra cả 2)
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // Hoặc kiểm tra trong Header (Bearer Token) - Thường dùng cho Postman/Mobile
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      // 2. Giải mã Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Tìm User trong CSDL và gắn vào req.user (để các controller sau dùng)
      // (.select('-password') nghĩa là không lấy trường password ra)
      req.user = await User.findById(decoded.userId).select('-password');

      next(); // Cho phép đi tiếp
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Không có quyền truy cập, Token không hợp lệ' });
    }
  } else {
    res.status(401).json({ message: 'Không có quyền truy cập, chưa có Token' });
  }
};

// Middleware phân quyền: Chỉ cho phép BQT (Admin)
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'bqt_admin') {
    next(); // Là Admin thì cho đi tiếp
  } else {
    res.status(403).json({ message: 'Chức năng này chỉ dành cho Ban Quản trị' });
  }
};

module.exports = { protect, admin };