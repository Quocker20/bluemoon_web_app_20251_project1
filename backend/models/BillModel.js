// File: backend/models/BillModel.js
const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  // Liên kết với hộ khẩu
  household: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    required: true
  },
  // Tên hóa đơn (VD: Hóa đơn tháng 10/2025)
  title: {
    type: String,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  // Danh sách các khoản phí chi tiết trong hóa đơn này
  // Cần lưu cứng (snapshot) giá trị tại thời điểm tạo, tránh việc Admin sửa giá Fee gốc làm sai lệch hóa đơn cũ
  items: [
    {
      feeName: { type: String, required: true },
      unitPrice: { type: Number, required: true },
      quantity: { type: Number, required: true }, // Diện tích hoặc Số người
      amount: { type: Number, required: true } // Thành tiền = unitPrice * quantity
    }
  ],
  // Tổng tiền phải đóng
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  // Trạng thái thanh toán
  status: {
    type: String,
    enum: ['Unpaid', 'Paid'],
    default: 'Unpaid'
  },
  // Ngày thanh toán (chỉ có khi status = Paid)
  paidAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bill', billSchema);