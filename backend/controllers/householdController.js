// File: backend/controllers/householdController.js
const Household = require('../models/HouseholdModel');
const Bill = require('../models/BillModel'); // [QUAN TRỌNG] Import Model Bill để kiểm tra nợ

// @desc    Tạo hộ khẩu mới
// @route   POST /api/households
const createHousehold = async (req, res) => {
  try {
    // [MỚI] Thêm ownerCCCD vào destructuring
    const { householdNumber, ownerName, ownerCCCD, phone, area, residents } = req.body;

    // Kiểm tra trùng lặp số căn hộ
    const householdExists = await Household.findOne({ householdNumber });
    if (householdExists) {
      return res.status(400).json({ message: 'Số căn hộ đã tồn tại' });
    }

    // Kiểm tra trùng CCCD chủ hộ
    const cccdExists = await Household.findOne({ ownerCCCD });
    if (cccdExists) {
      return res.status(400).json({ message: 'CCCD chủ hộ đã tồn tại trong hệ thống' });
    }

    const household = await Household.create({
      householdNumber,
      ownerName,
      ownerCCCD, // [MỚI] Lưu CCCD chủ hộ
      phone,
      area,
      residents: residents || [] 
    });

    res.status(201).json(household);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách tất cả hộ khẩu
// @route   GET /api/households
const getHouseholds = async (req, res) => {
  try {
    const households = await Household.find({});
    res.status(200).json(households);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy chi tiết 1 hộ khẩu (kèm nhân khẩu)
// @route   GET /api/households/:id
const getHouseholdById = async (req, res) => {
  try {
    const household = await Household.findById(req.params.id);
    if (household) {
      res.status(200).json(household);
    } else {
      res.status(404).json({ message: 'Không tìm thấy hộ khẩu' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật thông tin hộ khẩu
// @route   PUT /api/households/:id
const updateHousehold = async (req, res) => {
  try {
    const { id } = req.params;
    
    const household = await Household.findById(id);
    if (!household) {
      return res.status(404).json({ message: 'Không tìm thấy hộ khẩu' });
    }

    const updatedHousehold = await Household.findByIdAndUpdate(
      id,
      req.body, 
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedHousehold);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa hộ khẩu (Kiểm tra nợ trước khi xóa)
// @route   DELETE /api/households/:id
const deleteHousehold = async (req, res) => {
  try {
    const householdId = req.params.id;
    const household = await Household.findById(householdId);

    if (!household) {
      return res.status(404).json({ message: 'Không tìm thấy hộ khẩu' });
    }

    // 1. Kiểm tra nợ xấu trong bảng Bill
    const hasUnpaidBills = await Bill.findOne({ 
      household: householdId, 
      status: 'Unpaid' 
    });

    // 2. Nếu còn nợ -> Chặn xóa
    if (hasUnpaidBills) {
      return res.status(400).json({ 
        message: 'Không thể xóa! Hộ này vẫn còn hóa đơn chưa thanh toán. Vui lòng thanh toán hết công nợ trước khi xóa.' 
      });
    }

    // 3. Nếu sạch nợ -> Cho phép xóa
    await household.deleteOne();
    res.status(200).json({ message: 'Đã xóa hộ khẩu thành công' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Thêm nhân khẩu vào hộ
// @route   POST /api/households/:id/residents
const addResident = async (req, res) => {
    try {
        const household = await Household.findById(req.params.id);
        if (household) {
            household.residents.push(req.body); 
            const updatedHousehold = await household.save();
            res.status(200).json(updatedHousehold);
        } else {
            res.status(404).json({ message: 'Không tìm thấy hộ khẩu' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Xóa nhân khẩu khỏi hộ
// @route   DELETE /api/households/:id/residents/:residentId
const deleteResident = async (req, res) => {
  try {
        const household = await Household.findById(req.params.id);

        if (household) {
            const resident = household.residents.id(req.params.residentId);
            
            if (resident) {
                household.residents.pull(req.params.residentId); 
                await household.save();
                res.status(200).json({ message: 'Đã xóa nhân khẩu' });
            } else {
                res.status(404).json({ message: 'Không tìm thấy nhân khẩu' });
            }
        } else {
            res.status(404).json({ message: 'Không tìm thấy hộ khẩu' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
  createHousehold,
  getHouseholds,
  getHouseholdById,
  updateHousehold,
  deleteHousehold,
  addResident,
  deleteResident
};