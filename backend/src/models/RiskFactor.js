import mongoose from 'mongoose';

const riskFactorSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    label: { type: String, required: true },
  },
  { timestamps: true }
);

const RiskFactor = mongoose.model('RiskFactor', riskFactorSchema);

export default RiskFactor;
