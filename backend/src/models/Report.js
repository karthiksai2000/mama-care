import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    contentType: { type: String },
    size: { type: Number },
    analysisStatus: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;
