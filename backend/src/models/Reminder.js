import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    date: { type: Date },
  },
  { timestamps: true }
);

const Reminder = mongoose.model('Reminder', reminderSchema);

export default Reminder;
