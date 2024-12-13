// FILE: databaseConnectionService.js
const mongoose = require('mongoose');

exports.getClinicDatabaseConnection = async (databaseName) => {
  try {

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const clinicDb = await mongoose.createConnection(`${process.env.MONGODB_URI.replace('?', `${databaseName}?`)}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await new Promise((resolve, reject) => {
      clinicDb.on('connected', resolve);
      clinicDb.on('error', reject);
    });

    return clinicDb;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw new Error('Failed to connect to database');
  }
};