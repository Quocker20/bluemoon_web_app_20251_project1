// File: backend/controllers/householdController.js
const Household = require('../models/HouseholdModel');

// @desc    Tạo hộ khẩu mới
// @route   POST /api/households
const createHousehold = async (req, res) => {
  try {
    const { householdNumber, ownerName, phone, area } = req.body;

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
      residents: [] // Mặc định chưa có nhân khẩu
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
    const household = await Household.findById(req.params.id);

    if (household) {
      household.ownerName = req.body.ownerName || household.ownerName;
      household.phone = req.body.phone || household.phone;
      household.area = req.body.area || household.area;
      // Lưu ý: Không cho sửa householdNumber để đảm bảo tính nhất quán

      const updatedHousehold = await household.save();
      res.status(200).json(updatedHousehold);
    } else {
      res.status(404).json({ message: 'Không tìm thấy hộ khẩu' });
    }
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

// @desc    Thêm nhân khẩu vào hộ
// @route   POST /api/households/:id/residents
const addResident = async (req, res) => {
    try {
        const household = await Household.findById(req.params.id);

        if (household) {
        // Đẩy (push) nhân khẩu mới vào mảng residents
        household.residents.push(req.body); 
        
        // Lưu lại hộ khẩu (Mongoose sẽ tự tạo _id cho nhân khẩu mới)
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
        // Tìm và xóa nhân khẩu khỏi mảng (dùng phương thức pull của Mongoose Array)
        // Lưu ý: residents là mảng các Subdocument
        const resident = household.residents.id(req.params.residentId);
        
        if (resident) {
            // Mongoose >= 6.x: sử dụng pull hoặc remove trên subdoc
            // Cách an toàn nhất:
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