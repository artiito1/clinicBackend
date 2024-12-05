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
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);