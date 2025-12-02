// File: backend/controllers/feeController.js
const Fee = require('../models/FeeModel');

// @desc    Lấy danh sách các khoản phí (Có thể lọc theo trạng thái hoạt động)
// @route   GET /api/fees
// @access  Private/Admin
const getFees = async (req, res) => {
  try {
    const fees = await Fee.find({}); // Lấy tất cả, kể cả fee đã ẩn (để Admin quản lý)
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tạo một khoản phí mới
// @route   POST /api/fees
// @access  Private/Admin
const createFee = async (req, res) => {
  const { name, unitPrice, calculationUnit, description, isMandatory } = req.body;

  try {
    // Kiểm tra xem phí đã tồn tại chưa
    const feeExists = await Fee.findOne({ name });
    if (feeExists) {
      return res.status(400).json({ message: 'Khoản phí này đã tồn tại' });
    }

    const fee = await Fee.create({
      name,
      unitPrice,
      calculationUnit, // 'PER_M2', 'PER_HEAD', 'FIXED'
      description,
      isMandatory
    });

    res.status(201).json(fee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Cập nhật thông tin khoản phí
// @route   PUT /api/fees/:id
// @access  Private/Admin
const updateFee = async (req, res) => {
  const { name, unitPrice, calculationUnit, description, isActive } = req.body;

  try {
    const fee = await Fee.findById(req.params.id);

    if (fee) {
      fee.name = name || fee.name;
      fee.unitPrice = unitPrice !== undefined ? unitPrice : fee.unitPrice;
      fee.calculationUnit = calculationUnit || fee.calculationUnit;
      fee.description = description || fee.description;
      fee.isActive = isActive !== undefined ? isActive : fee.isActive;

      const updatedFee = await fee.save();
      res.json(updatedFee);
    } else {
      res.status(404).json({ message: 'Không tìm thấy khoản phí' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Xóa khoản phí (Thực chất nên dùng Soft Delete - ẩn đi thay vì xóa hẳn)
// @route   DELETE /api/fees/:id
// @access  Private/Admin
const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);

    if (fee) {
      await fee.deleteOne();
      res.json({ message: 'Đã xóa khoản phí thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy khoản phí' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFees,
  createFee,
  updateFee,
  deleteFee,
};