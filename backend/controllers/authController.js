// File: backend/controllers/authController.js

const User = require('../models/UserModel');
const generateToken = require('../utils/generateToken');

// @desc    Admin tạo user mới (Chỉ tạo, KHÔNG tự đăng nhập)
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { username, password, role, resident_id } = req.body;

    // 1. Kiểm tra username đã tồn tại chưa?
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }

    // 2. Tạo user mới
    const user = await User.create({
      username,
      password,
      role,
      resident_id 
    });

    // --- QUAN TRỌNG: Đã xóa dòng generateToken ở đây ---
    // Để không ghi đè cookie của Admin đang thao tác.

    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      message: 'Tạo tài khoản thành công!'
    });

  } catch (error) {
    res.status(500).json({ message: `Lỗi Server: ${error.message}` });
  }
};

// @desc    Đăng nhập (Xác thực) user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Tìm user bằng username
    const user = await User.findOne({ username });

    // 2. Kiểm tra user và so sánh mật khẩu
    if (user && (await user.matchPassword(password))) {
      // 3. Tạo Token và lưu vào Cookie (Chỉ xảy ra khi Login)
      generateToken(res, user._id, user.role);

      res.status(200).json({
        _id: user._id,
        username: user.username,
        role: user.role
      });
    } else {
      res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }
  } catch (error) {
    res.status(500).json({ message: `Lỗi Server: ${error.message}` });
  }
};

module.exports = { registerUser, loginUser };