// File: backend/controllers/billController.js
const Bill = require('../models/BillModel');
const Fee = require('../models/FeeModel');
const Household = require('../models/HouseholdModel');

// @desc    Tạo hóa đơn tháng cho một hộ gia đình cụ thể
// @route   POST /api/bills
// @access  Private/Admin
const createMonthlyBill = async (req, res) => {
  const { householdId, month, year, title } = req.body;

  try {
    // 1. Kiểm tra xem hộ này đã có hóa đơn tháng này chưa?
    const existingBill = await Bill.findOne({ household: householdId, month, year });
    if (existingBill) {
      return res.status(400).json({ message: `Hộ này đã có hóa đơn tháng ${month}/${year}` });
    }

    // 2. Lấy thông tin hộ khẩu (để biết diện tích, nhân khẩu)
    const household = await Household.findById(householdId);
    if (!household) {
      return res.status(404).json({ message: 'Không tìm thấy hộ khẩu' });
    }

    // 3. Lấy danh sách các khoản phí đang HOẠT ĐỘNG
    const activeFees = await Fee.find({ isActive: true });
    
    if (activeFees.length === 0) {
      return res.status(400).json({ message: 'Chưa có khoản phí nào được kích hoạt' });
    }

    let totalAmount = 0;
    const billItems = [];

    // 4. LOGIC TÍNH TOÁN (CORE)
    // Duyệt qua từng loại phí để tính tiền
    activeFees.forEach(fee => {
      let quantity = 0;
      let amount = 0;

      // Logic switch-case dựa trên đơn vị tính
      switch (fee.calculationUnit) {
        case 'PER_M2': // Tính theo diện tích
          quantity = household.area;
          amount = fee.unitPrice * quantity;
          break;
        
        case 'PER_HEAD': // Tính theo đầu người
          quantity = household.residents.length;
          amount = fee.unitPrice * quantity;
          break;

        case 'FIXED': // Giá cố định
        default:
          quantity = 1;
          amount = fee.unitPrice;
          break;
      }

      // Cộng dồn tổng tiền
      totalAmount += amount;

      // Đẩy vào danh sách chi tiết
      billItems.push({
        feeName: fee.name,
        unitPrice: fee.unitPrice,
        quantity: quantity,
        amount: amount
      });
    });

    // 5. Lưu hóa đơn vào Database
    const newBill = await Bill.create({
      household: householdId,
      title: title || `Hóa đơn phí dịch vụ tháng ${month}/${year}`,
      month,
      year,
      items: billItems,
      totalAmount,
      status: 'Unpaid' // Mặc định là chưa đóng
    });

    res.status(201).json(newBill);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách hóa đơn (có thể lọc theo hộ gia đình)
// @route   GET /api/bills
const getBills = async (req, res) => {
  try {
    const { householdId } = req.query;
    let query = {};
    if (householdId) {
      query.household = householdId;
    }

    // populate('household') để lấy luôn tên chủ hộ thay vì chỉ hiện ID
    const bills = await Bill.find(query)
        .populate('household', 'householdNumber ownerName') 
        .sort({ createdAt: -1 });
        
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ghi nhận thanh toán cho một hóa đơn
// @route   PUT /api/bills/:id/pay
// @access  Private/Admin
const payBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (bill) {
      if (bill.status === 'Paid') {
        return res.status(400).json({ message: 'Hóa đơn này đã được thanh toán trước đó rồi!' });
      }

      bill.status = 'Paid';
      bill.paidAt = Date.now(); // Lưu thời điểm đóng tiền

      const updatedBill = await bill.save();
      res.json(updatedBill);
    } else {
      res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createMonthlyBill, getBills, payBill };