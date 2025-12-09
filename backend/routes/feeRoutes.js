const express = require('express');
const router = express.Router();
const { getFees, createFee, deleteFee } = require('../controllers/feeController');

router.route('/').get(getFees).post(createFee);
router.route('/:id').delete(deleteFee);

module.exports = router;