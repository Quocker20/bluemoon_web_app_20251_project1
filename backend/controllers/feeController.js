const Fee = require('../models/FeeModel');

const getFees = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const fees = await Fee.find({ ...keyword });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (fee) {
      res.json(fee);
    } else {
      res.status(404).json({ message: 'Không tìm thấy khoản phí' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFee = async (req, res) => {
  try {
    const { name, unitPrice, calculationUnit, description, isMandatory, isActive } = req.body;
    const fee = await Fee.create({ name, unitPrice, calculationUnit, description, isMandatory, isActive });
    res.status(201).json(fee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateFee = async (req, res) => {
  try {
    const { name, unitPrice, calculationUnit, description, isMandatory, isActive } = req.body;
    const fee = await Fee.findById(req.params.id);

    if (fee) {
      fee.name = name || fee.name;
      fee.unitPrice = unitPrice !== undefined ? unitPrice : fee.unitPrice;
      fee.calculationUnit = calculationUnit || fee.calculationUnit;
      fee.description = description || fee.description;
      fee.isMandatory = isMandatory !== undefined ? isMandatory : fee.isMandatory;
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

module.exports = { 
  getFees, 
  getFeeById, 
  createFee, 
  updateFee, 
  deleteFee 
};