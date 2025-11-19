// File: backend/routes/householdRoutes.js
const express = require('express');
const router = express.Router();
const {
  createHousehold,
  getHouseholds,
  getHouseholdById,
  updateHousehold,
  deleteHousehold,
  addResident,
  deleteResident
} = require('../controllers/householdController');

// Import Middleware bảo vệ
const { protect, admin } = require('../middleware/authMiddleware');

// Áp dụng bảo vệ cho TẤT CẢ các routes bên dưới
// (Nghĩa là: Phải đăng nhập VÀ phải là Admin mới được dùng các API này)
router.use(protect);
router.use(admin);

router.route('/')
  .post(createHousehold)
  .get(getHouseholds);

router.route('/:id')
  .get(getHouseholdById)
  .put(updateHousehold)
  .delete(deleteHousehold);

router.route('/:id/residents').post(addResident);
router.route('/:id/residents/:residentId').delete(deleteResident);

module.exports = router;