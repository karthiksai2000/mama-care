import mongoose from 'mongoose';

const contractionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    start: { type: Date, required: true },
    duration: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const Contraction = mongoose.model('Contraction', contractionSchema);

export default Contraction;
