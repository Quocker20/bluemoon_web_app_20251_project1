// File: backend/controllers/authController.js

const User = require('../models/UserModel'); // Import UserModel (Task 3)
const generateToken = require('../utils/generateToken');

// @desc    Đăng ký user mới
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
    // (Mật khẩu sẽ tự động được băm (hash) nhờ 'pre-save hook' trong UserModel)
    const user = await User.create({
      username,
      password,
      role,
      resident_id 
    });

    // 3. Tạo Token và trả về
    generateToken(res, user._id, user.role);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role
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

    // 2. Kiểm tra user và so sánh mật khẩu (dùng hàm matchPassword)
    if (user && (await user.matchPassword(password))) {
      // 3. Tạo Token và trả về
      generateToken(res, user._id, user.role);

      res.status(200).json({
        _id: user._id,
        username: user.username,
        role: user.role
      });
    } else {
      // Nếu user không tồn tại hoặc sai mật khẩu
      res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }
  } catch (error) {
    res.status(500).json({ message: `Lỗi Server: ${error.message}` });
  }
};

module.exports = { registerUser, loginUser };