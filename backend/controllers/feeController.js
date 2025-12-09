const Fee = require('../models/FeeModel');

// 1. Lấy danh sách phí
const getFees = async (req, res) => {
  try {
    const fees = await Fee.find({});
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Tạo phí mới
const createFee = async (req, res) => {
  try {
    const { name, unitPrice, calculationUnit, description, isMandatory } = req.body;
    const fee = await Fee.create({ name, unitPrice, calculationUnit, description, isMandatory });
    res.status(201).json(fee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 3. Xóa phí
const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (fee) {
      await fee.deleteOne();
      res.json({ message: 'Đã xóa khoản phí' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy khoản phí' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFees, createFee, deleteFee };