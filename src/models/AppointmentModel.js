const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, 'Patient name is required']
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required']
  },
  toothNumber: {
    type: Number,
    required: [true, 'Tooth number is required'],
    min: 1,
    max: 32
  },
  treatment: {
    type: String,
    required: [true, 'Treatment description is required']
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  sessionNumber: {
    type: Number,
    default: 1
  },
  cost: {
    type: Number,
    required: [true, 'Treatment cost is required']
  },
  notes: String,
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: [true, 'Clinic ID is required']
  }
}, { timestamps: true });

// إضافة فهرس مركب للبحث عن المواعيد حسب المريض والسن
appointmentSchema.index({ patientId: 1, toothNumber: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);