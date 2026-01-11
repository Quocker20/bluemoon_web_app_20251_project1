const { VNPay } = require('vnpay');
const Bill = require('../models/BillModel');
const dateFormat = require('date-format');

const vnpay = new VNPay({
  tmnCode: 'JISH97HI',
  secureSecret: 'L4WAM4RVIQJAV80Z8CX2ZS62U0DNDI7Z',
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true,
  hashAlgorithm: 'SHA512',
  enableLog: true,
  loggerFn: (log) => console.log(`[VNPAY_LIB] ${log}`),
});

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
      vnp_ReturnUrl: 'http://localhost:5173/payment-result',
      vnp_Locale: 'vn',
    });

    console.log("-> URL Payment Created:", paymentUrl);
    res.status(200).json({ paymentUrl });
  } catch (error) {
    console.error("Error creating payment URL:", error);
    res.status(500).json({ message: error.message });
  }
};

const vnpayIpn = async (req, res) => {
  try {
    const verify = vnpay.verifyIpnCall(req.query);

    if (!verify.isVerified) {
      console.log("❌ IPN Checksum Failed");
      return res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
    }

    const txnRef = verify.vnp_TxnRef;
    const billId = txnRef.split('_')[0];

    console.log(`✅ IPN Verified. BillID: ${billId}, Status: ${verify.vnp_ResponseCode}`);

    const bill = await Bill.findById(billId);
    if (!bill) return res.status(200).json({ RspCode: '01', Message: 'Order not found' });

    if (verify.isSuccess) {
      if (bill.status !== 'Paid') {
        bill.status = 'Paid';
        bill.paymentMethod = 'VNPAY';
        bill.transactionId = verify.vnp_TransactionNo;
        bill.payDate = new Date();
        await bill.save();
        console.log("-> Bill updated to Paid");
        return res.status(200).json({ RspCode: '00', Message: 'Success' });
      } else {
        return res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
      }
    } else {
      console.log("-> Transaction Failed/Cancelled");
      return res.status(200).json({ RspCode: '00', Message: 'Transaction Failed' });
    }
  } catch (error) {
    console.error("IPN Error:", error);
    res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
  }
};

module.exports = { createPaymentUrl, vnpayIpn };