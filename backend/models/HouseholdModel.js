// File: backend/models/HouseholdModel.js
const mongoose = require('mongoose');

// 1. Định nghĩa Schema con: Nhân khẩu (Resident)
const residentSchema = new mongoose.Schema({
  residentName: {
    type: String,
    required: [true, 'Vui lòng nhập tên nhân khẩu'],
  },
  dob: {
    type: Date,
  },
  cccd: {
    type: String,
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
    unique: true,
  },
  ownerName: {
    type: String,
    required: [true, 'Vui lòng nhập tên chủ hộ'],
  },
  // [MỚI] Thêm CCCD Chủ hộ (Bắt buộc)
  ownerCCCD: {
    type: String,
    required: [true, 'Vui lòng nhập CCCD chủ hộ'],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, 'Vui lòng nhập số điện thoại liên hệ'],
  },
  area: {
    type: Number,
    required: [true, 'Vui lòng nhập diện tích căn hộ'],
  },
  residents: [residentSchema] 
}, {
  timestamps: true
});

module.exports = mongoose.model('Household', householdSchema);