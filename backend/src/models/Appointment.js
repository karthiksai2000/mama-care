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
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
