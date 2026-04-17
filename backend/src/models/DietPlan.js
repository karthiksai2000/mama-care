import mongoose from 'mongoose';

const dietMealSchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    items: { type: [String], default: [] },
  },
  { _id: false }
);

const dietPlanSchema = new mongoose.Schema(
  {
    trimester: { type: Number, required: true },
    week: { type: Number, required: true },
    meals: { type: [dietMealSchema], default: [] },
    tips: { type: [String], default: [] },
  },
  { timestamps: true }
);

dietPlanSchema.index({ trimester: 1, week: 1 }, { unique: true });

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);

export default DietPlan;
