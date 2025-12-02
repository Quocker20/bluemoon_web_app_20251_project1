// File: backend/models/FeeModel.js
const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên khoản phí (VD: Phí quản lý, Phí vệ sinh)'],
    trim: true
  },
  unitPrice: {
    type: Number,
    required: [true, 'Vui lòng nhập đơn giá'],
    default: 0
  },
  // Đơn vị tính: Để hệ thống biết cách nhân tiền
  // 'PER_M2': Nhân theo diện tích (area)
  // 'PER_HEAD': Nhân theo số người (residents.length)
  // 'FIXED': Giá cố định theo hộ (1 lần thu)
  calculationUnit: {
    type: String,
    enum: ['PER_M2', 'PER_HEAD', 'FIXED'], 
    required: true,
    default: 'FIXED'
  },
  description: {
    type: String,
  },
  // Loại phí: Bắt buộc hay Tự nguyện
  isMandatory: {
    type: Boolean,
    default: true, // Mặc định là bắt buộc đóng
  },
  isActive: {
    type: Boolean,
    default: true // Nếu false thì không hiện ra khi tạo hóa đơn mới
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Fee', feeSchema);