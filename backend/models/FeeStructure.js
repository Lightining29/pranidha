import mongoose from 'mongoose';

const CustomFeeComponentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true, default: 0 }
});

const FeeStructureSchema = new mongoose.Schema({
  class: {
    type: String,
    required: [true, 'Please specify the class'],
    enum: [
      'Nursery', 'LKG', 'UKG',
      'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
      'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
      'Class 11', 'Class 12'
    ],
    unique: true
  },
  admissionFee: { type: Number, default: 0 },
  tuitionFee: { type: Number, default: 0 },
  computerFee: { type: Number, default: 0 },
  developmentFee: { type: Number, default: 0 },
  activityFee: { type: Number, default: 0 },
  smartClassFee: { type: Number, default: 0 },
  transportFee: { type: Number, default: 0 },
  examinationFee: { type: Number, default: 0 },
  annualCharges: { type: Number, default: 0 },
  customFees: [CustomFeeComponentSchema],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('FeeStructure', FeeStructureSchema);
