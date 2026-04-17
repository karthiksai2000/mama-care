import mongoose from 'mongoose';

const healthTrendSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    week: { type: Number, required: true },
    hemoglobin: { type: Number },
    bp: { type: String },
  },
  { timestamps: true }
);

healthTrendSchema.index({ userId: 1, week: 1 }, { unique: true });

const HealthTrend = mongoose.model('HealthTrend', healthTrendSchema);

export default HealthTrend;
