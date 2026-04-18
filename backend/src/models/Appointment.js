import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    doctor: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, default: '' },
    notes: { type: String, default: '' },
    reminderSentAt: { type: Date, default: null },
    confirmationSentAt: { type: Date, default: null },
    reminder30SentAt: { type: Date, default: null },
    reminderAtSentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
