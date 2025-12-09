const Bill = require('../models/BillModel');
const Fee = require('../models/FeeModel');
const Household = require('../models/HouseholdModel');

// 1. Tạo hóa đơn hàng loạt (Generate)
const generateAllMonthlyBills = async (req, res) => {
  const { month, year } = req.body;
  if (!month || !year) return res.status(400).json({ message: 'Thiếu tháng/năm' });

  try {
    const existing = await Bill.countDocuments({ month, year });
    if (existing > 0) return res.status(400).json({ message: `Tháng ${month}/${year} đã có hóa đơn.` });

    const households = await Household.find({});
    const activeFees = await Fee.find({ isActive: true });

    if (!activeFees.length) return res.status(400).json({ message: 'Chưa có phí nào active' });

    const newBills = [];
    households.forEach(hh => {
      let total = 0;
      const items = [];
      activeFees.forEach(fee => {
        let qty = 1;
        if (fee.calculationUnit === 'PER_M2') qty = hh.area;
        else if (fee.calculationUnit === 'PER_HEAD') qty = hh.residents ? hh.residents.length : 0;
        
        const amt = fee.unitPrice * qty;
        total += amt;
        items.push({ feeName: fee.name, unitPrice: fee.unitPrice, quantity: qty, amount: amt });
      });

      if (total > 0) {
        newBills.push({
          household: hh._id,
          title: `Hóa đơn tháng ${month}/${year}`,
          month, year, items, totalAmount: total, status: 'Unpaid'
        });
      }
    });

    if (newBills.length > 0) await Bill.insertMany(newBills);
    
    res.status(201).json({ message: `Đã tạo ${newBills.length} hóa đơn.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Lấy danh sách hóa đơn
const getBills = async (req, res) => {
  try {
    // Populate để lấy thông tin số phòng từ ID hộ khẩu
    const bills = await Bill.find().populate('household', 'householdNumber ownerName').sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateAllMonthlyBills, getBills };