// File: backend/models/BillModel.js
const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  household: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true },
  title: { type: String, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  items: [
    {
      feeName: { type: String, required: true },
      unitPrice: { type: Number, required: true },
      quantity: { type: Number, required: true }, 
      amount: { type: Number, required: true } 
    }
  ],
  totalAmount: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },

  // --- [MỚI] Phần bổ sung cho thanh toán & báo cáo ---
  paymentMethod: { 
    type: String, 
    enum: ['Cash', 'VNPAY', 'BankTransfer'], 
    default: 'Cash' 
  },
  transactionId: { type: String }, // Mã giao dịch của VNPAY (để đối soát)
  payDate: { type: Date }          // Ngày giờ thanh toán thực tế
  // --------------------------------------------------

}, { timestamps: true });

// Index tránh trùng hóa đơn tháng
billSchema.index({ household: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Bill', billSchema);