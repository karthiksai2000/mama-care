import mongoose from 'mongoose';

const symptomSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    severity: { type: Number, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const Symptom = mongoose.model('Symptom', symptomSchema);

export default Symptom;
