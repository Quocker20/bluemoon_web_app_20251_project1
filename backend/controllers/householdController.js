// File: backend/controllers/householdController.js
const Household = require('../models/HouseholdModel');

// @desc    Tạo hộ khẩu mới
// @route   POST /api/households
const createHousehold = async (req, res) => {
  try {
    const { householdNumber, ownerName, phone, area, residents } = req.body;

    // Kiểm tra trùng lặp số căn hộ
    const householdExists = await Household.findOne({ householdNumber });
    if (householdExists) {
      return res.status(400).json({ message: 'Số căn hộ đã tồn tại' });
    }

    const household = await Household.create({
      householdNumber,
      ownerName,
      phone,
      area,
      // SỬA: Lấy residents từ form gửi lên, nếu không có thì mới để rỗng
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

// @desc    Cập nhật thông tin hộ khẩu (BAO GỒM CẢ NHÂN KHẨU)
// @route   PUT /api/households/:id
const updateHousehold = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Kiểm tra tồn tại
    const household = await Household.findById(id);
    if (!household) {
      return res.status(404).json({ message: 'Không tìm thấy hộ khẩu' });
    }

    // SỬA: Dùng findByIdAndUpdate để cập nhật toàn bộ fields từ req.body
    // (Bao gồm cả ownerName, phone, area VÀ residents)
    const updatedHousehold = await Household.findByIdAndUpdate(
      id,
      req.body, 
      { new: true, runValidators: true } // Trả về data mới nhất & kiểm tra validate
    );

    res.status(200).json(updatedHousehold);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa hộ khẩu
// @route   DELETE /api/households/:id
const deleteHousehold = async (req, res) => {
  try {
    const household = await Household.findById(req.params.id);

    if (household) {
      await household.deleteOne();
      res.status(200).json({ message: 'Đã xóa hộ khẩu thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy hộ khẩu' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Thêm nhân khẩu vào hộ (API phụ - Dùng cho mobile sau này nếu cần)
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

// @desc    Xóa nhân khẩu khỏi hộ (API phụ)
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
                res.status(404).json({ message: 'Không tìm thấy nhân khẩu trong hộ này' });
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