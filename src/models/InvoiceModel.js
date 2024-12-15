const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['clinic', 'patient'],
    required: true
  },
  description: {
    type: String,
    required: function() { return this.type === 'clinic'; }
  },
  patientName: {
    type: String,
    required: function() { return this.type === 'patient'; }
  },
  status: {
    type: String,
    enum: ['paid', 'unpaid', 'partially paid'],
    required: function() { return this.type === 'patient'; }
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: function() { return this.type === 'patient'; }
  }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);