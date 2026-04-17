import mongoose from 'mongoose';

const babyGrowthSchema = new mongoose.Schema(
  {
    week: { type: Number, required: true, unique: true },
    fruit: { type: String, required: true },
    fruitName: { type: String, required: true },
    length: { type: String, required: true },
    weight: { type: String, required: true },
    dev: { type: [String], default: [] },
  },
  { timestamps: true }
);

const BabyGrowth = mongoose.model('BabyGrowth', babyGrowthSchema);

export default BabyGrowth;
