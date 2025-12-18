// File: backend/utils/generateToken.js

const jwt = require('jsonwebtoken');

const generateToken = (res, userId, userRole) => {
  const token = jwt.sign(
    { userId, role: userRole }, // Nội dung (payload) của Token
    process.env.JWT_SECRET,    // Khóa bí mật (lấy từ .env)
    { expiresIn: '8h' }       // Hết hạn sau 30 ngày
  );

  // (Tùy chọn) Gửi Token qua HTTP-Only Cookie (Bảo mật hơn)
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Chỉ HTTPS ở production
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 ngày (tính bằng mili-giây)
  });
};

module.exports = generateToken;