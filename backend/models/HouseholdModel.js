// File: backend/models/HouseholdModel.js

const mongoose = require('mongoose');

// 1. Định nghĩa Schema con: Nhân khẩu (Resident)
// (Schema này sẽ được NHÚNG vào bên trong Household, không đứng riêng)
const residentSchema = new mongoose.Schema({
  residentName: {
    type: String,
    required: [true, 'Vui lòng nhập tên nhân khẩu'],
  },
  dob: {
    type: Date,
    // required: true, // Tạm thời để optional để dễ test
  },
  cccd: {
    type: String,
    // sparse: true cho phép nhiều giá trị null (trẻ em không có CCCD)
    // nhưng nếu có giá trị thì phải là duy nhất.
    unique: true, 
    sparse: true, 
  },
  relationToOwner: {
    type: String,
    required: [true, 'Vui lòng nhập quan hệ với chủ hộ'],
  }
});

// 2. Định nghĩa Schema cha: Hộ khẩu (Household)
const householdSchema = new mongoose.Schema({
  householdNumber: {
    type: String,
    required: [true, 'Vui lòng nhập số căn hộ (ví dụ: A-101)'],
    unique: true, // Số căn hộ không được trùng
  },
  ownerName: {
    type: String,
    required: [true, 'Vui lòng nhập tên chủ hộ'],
  },
  phone: {
    type: String,
    required: [true, 'Vui lòng nhập số điện thoại liên hệ'],
  },
  area: {
    type: Number,
    required: [true, 'Vui lòng nhập diện tích căn hộ'],
  },
  // Mảng nhúng chứa các Nhân khẩu
  residents: [residentSchema] 
}, {
  timestamps: true
});

module.exports = mongoose.model('Household', householdSchema);