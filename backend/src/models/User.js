import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    pregnancyWeek: { type: Number, default: 1 },
    conditions: { type: [String], default: [] },
    dueDate: { type: Date, default: null },
    firstPregnancy: { type: Boolean, default: null },
    healthGoals: { type: [String], default: [] },
    reminderPreferences: { type: [String], default: [] },
    emotionalSupport: { type: [String], default: [] },
    onboardingCompleted: { type: Boolean, default: false },
    onboardingCompletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
