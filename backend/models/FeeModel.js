const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  unitPrice: { type: Number, required: true, default: 0 },
  // 'PER_M2', 'PER_HEAD', 'FIXED'
  calculationUnit: { type: String, required: true, enum: ['PER_M2', 'PER_HEAD', 'FIXED'] },
  description: { type: String },
  isMandatory: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);