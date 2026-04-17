import mongoose from 'mongoose';

const riskAssessmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true },
    level: { type: String, required: true },
    bmi: { type: Number },
    inputs: {
      age: Number,
      systolic: Number,
      diastolic: Number,
      hemoglobin: Number,
      weight: Number,
      height: Number,
    },
    factors: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
  },
  { timestamps: true }
);

const RiskAssessment = mongoose.model('RiskAssessment', riskAssessmentSchema);

export default RiskAssessment;
