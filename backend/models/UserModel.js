// File: backend/models/UserModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

// 1. Định nghĩa Schema (dựa trên Thiết kế Tuần 3)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Vui lòng nhập tên đăng nhập'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu'],
  },
  role: {
    type: String,
    enum: ['bqt_admin', 'cu_dan'],
    required: true,
  },
  resident_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household.residents', 
    required: false, 
  }
}, {
  timestamps: true // Tự động thêm 2 trường: createdAt và updatedAt
});

// 2. Mã hóa Mật khẩu TỰ ĐỘNG trước khi Lưu (pre-save hook)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10); 
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 3. Thêm Method (hàm) để so sánh mật khẩu
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 4. Xuất (Export) Model
module.exports = mongoose.model('User', userSchema);