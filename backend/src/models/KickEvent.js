import mongoose from 'mongoose';

const kickEventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ts: { type: Date, required: true },
  },
  { timestamps: true }
);

const KickEvent = mongoose.model('KickEvent', kickEventSchema);

export default KickEvent;
