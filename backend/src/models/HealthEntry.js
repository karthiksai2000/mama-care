import mongoose from 'mongoose';

const healthEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    hydration: { type: Number },
    sleep: { type: Number },
    mood: { type: String },
  },
  { timestamps: true }
);

const HealthEntry = mongoose.model('HealthEntry', healthEntrySchema);

export default HealthEntry;
