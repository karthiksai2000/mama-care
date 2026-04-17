import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    pregnancyWeek: { type: Number, default: 1 },
    conditions: { type: [String], default: [] },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
