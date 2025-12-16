const Household = require('../models/HouseholdModel');
const Bill = require('../models/BillModel');

const getDashboardStats = async (req, res) => {
  try {
    const totalHouseholds = await Household.countDocuments();

    const households = await Household.find().select('residents');
    const totalResidents = households.reduce((acc, curr) => {
      return acc + 1 + (curr.residents ? curr.residents.length : 0);
    }, 0);

    const paidBills = await Bill.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = paidBills.length > 0 ? paidBills[0].total : 0;

    const unpaidBills = await Bill.aggregate([
      { $match: { status: 'Unpaid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const pendingRevenue = unpaidBills.length > 0 ? unpaidBills[0].total : 0;

    res.status(200).json({
      totalHouseholds,
      totalResidents,
      totalRevenue,
      pendingRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };