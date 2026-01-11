// File: backend/controllers/paymentController.js
const { VNPay } = require('vnpay');
const Bill = require('../models/BillModel');
const dateFormat = require('date-format');

// Cấu hình VNPAY (Key của bạn)
const vnpay = new VNPay({
  tmnCode: 'JISH97HI',
  secureSecret: 'L4WAM4RVIQJAV80Z8CX2ZS62U0DNDI7Z',
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true,
  hashAlgorithm: 'SHA512',
  enableLog: true,
  loggerFn: (log) => console.log(`[VNPAY_LIB] ${log}`),
});

// 1. API Tạo URL thanh toán
const createPaymentUrl = async (req, res) => {
  try {
    const { billId, amount } = req.body;
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    
    const uniqueTxnRef = `${billId}_${dateFormat('yyyyMMddHHmmss', new Date())}`;

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: '127.0.0.1',
      vnp_TxnRef: uniqueTxnRef,
      vnp_OrderInfo: `Thanh toan hoa don ${billId}`,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: 'http://localhost:5173/payment-result', // Quay về Frontend
      vnp_Locale: 'vn',
    });

    console.log("-> URL Payment Created:", paymentUrl);
    res.status(200).json({ paymentUrl });
  } catch (error) {
    console.error("Error creating payment URL:", error);
    res.status(500).json({ message: error.message });
  }
};

// 2. API IPN (Dành cho Server thật, Localhost không chạy được cái này)
const vnpayIpn = async (req, res) => {
  try {
    const verify = vnpay.verifyIpnCall(req.query);

    if (!verify.isVerified) return res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });

    const txnRef = verify.vnp_TxnRef;
    const billId = txnRef.split('_')[0];
    const bill = await Bill.findById(billId);

    if (!bill) return res.status(200).json({ RspCode: '01', Message: 'Order not found' });

    if (verify.isSuccess) {
      if (bill.status !== 'Paid') {
        bill.status = 'Paid';
        bill.paymentMethod = 'VNPAY';
        bill.transactionId = verify.vnp_TransactionNo;
        bill.payDate = new Date();
        await bill.save();
        console.log("(IPN) Bill updated to Paid");
        return res.status(200).json({ RspCode: '00', Message: 'Success' });
      } else {
        return res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
      }
    } 
    return res.status(200).json({ RspCode: '00', Message: 'Transaction Failed' });
  } catch (error) {
    console.error("IPN Error:", error);
    res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
  }
};

// 3. API Return (Xử lý cho Localhost: Frontend gọi vào đây để update DB)
const vnpayReturn = async (req, res) => {
  try {
    const verify = vnpay.verifyReturnUrl(req.query);

    if (!verify.isVerified) {
      return res.status(200).json({ message: 'Chữ ký không hợp lệ', code: '97' });
    }

    if (!verify.isSuccess) {
      return res.status(200).json({ message: 'Giao dịch thất bại', code: '99' });
    }

    const txnRef = verify.vnp_TxnRef;
    const billId = txnRef.split('_')[0];
    const bill = await Bill.findById(billId);

    if (!bill) return res.status(404).json({ message: 'Không tìm thấy hóa đơn', code: '01' });

    if (bill.status !== 'Paid') {
      bill.status = 'Paid';
      bill.paymentMethod = 'VNPAY';
      bill.transactionId = verify.vnp_TransactionNo;
      bill.payDate = new Date();
      await bill.save();
      console.log("(Return) Bill updated to Paid");
      return res.status(200).json({ message: 'Giao dịch thành công', code: '00' });
    } else {
      return res.status(200).json({ message: 'Hóa đơn đã được thanh toán trước đó', code: '00' });
    }
  } catch (error) {
    console.error("Return Error:", error);
    res.status(500).json({ message: 'Lỗi Server', code: '99' });
  }
};

module.exports = { createPaymentUrl, vnpayIpn, vnpayReturn };