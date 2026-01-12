const User = require('../models/UserModel');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
  try {
    const { username, password, role, resident_id } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }

    const user = await User.create({
      username,
      password,
      role,
      resident_id 
    });

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

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
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

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // req.user được lấy từ middleware 'protect'
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(oldPassword))) {
      user.password = newPassword;
      // Khi save(), pre-save hook trong Model sẽ tự động hash password mới
      await user.save(); 
      res.status(200).json({ message: 'Đổi mật khẩu thành công!' });
    } else {
      res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  registerUser, 
  loginUser,
  changePassword 
};