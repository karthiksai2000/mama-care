import mongoose from 'mongoose';

const weightEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    weight: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const WeightEntry = mongoose.model('WeightEntry', weightEntrySchema);

export default WeightEntry;
