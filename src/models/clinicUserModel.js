const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const clinicUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'doctor', 'receptionist'], default: 'admin' },
  clinicName: { type: String, required: true },
  databaseName: { type: String, required: true },
});

clinicUserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
}); 

module.exports = mongoose.model('ClinicUser', clinicUserSchema);