const Household = require('../models/HouseholdModel');
const Bill = require('../models/BillModel');

const createHousehold = async (req, res) => {
  try {
    const { householdNumber, ownerName, ownerCCCD, phone, area, residents } = req.body;

    const householdExists = await Household.findOne({ householdNumber });
    if (householdExists) {
      return res.status(400).json({ message: 'Số căn hộ đã tồn tại' });
    }

    const cccdExists = await Household.findOne({ ownerCCCD });
    if (cccdExists) {
      return res.status(400).json({ message: 'CCCD chủ hộ đã tồn tại trong hệ thống' });
    }

    const household = await Household.create({
      householdNumber,
      ownerName,
      ownerCCCD,
      phone,
      area,
      residents: residents || [] 
    });

    res.status(201).json(household);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHouseholds = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          householdNumber: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const households = await Household.find({ ...keyword });
    res.status(200).json(households);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

const deleteHousehold = async (req, res) => {
  try {
    const householdId = req.params.id;
    const household = await Household.findById(householdId);

    if (!household) {
      return res.status(404).json({ message: 'Không tìm thấy hộ khẩu' });
    }

    const hasUnpaidBills = await Bill.findOne({ 
      household: householdId, 
      status: 'Unpaid' 
    });

    if (hasUnpaidBills) {
      return res.status(400).json({ 
        message: 'Không thể xóa! Hộ này vẫn còn hóa đơn chưa thanh toán. Vui lòng thanh toán hết công nợ trước khi xóa.' 
      });
    }

    await household.deleteOne();
    res.status(200).json({ message: 'Đã xóa hộ khẩu thành công' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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