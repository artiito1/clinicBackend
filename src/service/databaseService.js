const mongoose = require('mongoose');

exports.createClinicDatabase = async (clinicName) => {
  const date = new Date();
  const dbName = `clinic_${clinicName
    .replace(/\s+/g, '_')
    .toLowerCase()}_${date
      .getFullYear()}${(date
        .getMonth() + 1)
        .toString()
        .padStart(2, '0')}${date
          .getDate()
          .toString()
          .padStart(2, '0')}`;

  const clinicDb = await mongoose.createConnection(`${process.env.MONGO_URI.replace('?', `${dbName}?`)}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await new Promise((resolve) => {
    clinicDb.on('connected', resolve); 
  });

  return { dbName, clinicDb };
};

exports.createAppointmentModel = (clinicDb) => {
  const AppointmentSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    reason: { type: String },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return clinicDb.model('Appointment', AppointmentSchema);
};

exports.createTestAppointment = async (AppointmentModel) => {
  const testAppointment = new AppointmentModel({
    patientName: 'مريض تجريبي',
    date: new Date(),
    time: '10:00',
    reason: 'فحص عام',
    status: 'scheduled'
  });
  await testAppointment.save();
};