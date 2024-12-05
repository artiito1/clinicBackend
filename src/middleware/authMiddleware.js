const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const mongoose = require('mongoose');

const connectToDatabase = async (databaseName) => {
  try {
    const baseUri = process.env.MONGODB_URI.split('/').slice(0, -1).join('/');
    const clinicDbUri = `${baseUri}/${databaseName}?retryWrites=true&w=majority&appName=Cluster0`;
    const connection = await mongoose.createConnection(clinicDbUri);
    console.log(`Connected to database: ${databaseName}`);
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new ApiError('Database connection failed', 500);
  }
};

const createModels = (connection) => {
  try {
    const models = {
      Patient: connection.model('Patient', require('../models/patientModel').schema),
      Appointment: connection.model('Appointment', require('../models/AppointmentModel').schema),
      Invoice: connection.model('Invoice', require('../models/InvoiceModel').schema)
    };
    console.log('Models created successfully');
    return models;
  } catch (error) {
    console.error('Model creation error:', error);
    throw new ApiError('Failed to create database models', 500);
  }
};

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const databaseName = req.headers['x-database-name'];

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!databaseName || decoded.databaseName !== databaseName) {
        throw new ApiError('Invalid database information', 401);
      }

      req.user = decoded;

      if (!req.app.locals.connections) {
        req.app.locals.connections = {};
      }

      if (!req.app.locals.connections[databaseName]) {
        req.app.locals.connections[databaseName] = await connectToDatabase(databaseName);
      }

      req.clinicDb = req.app.locals.connections[databaseName];
      req.models = createModels(req.clinicDb);

      next();
    } catch (error) {
      throw new ApiError('Invalid token', 401);
    }
  } else {
    throw new ApiError('Not authorized, no token', 401);
  }
});

const cleanupConnections = async (app) => {
  if (app.locals.connections) {
    for (const [dbName, connection] of Object.entries(app.locals.connections)) {
      try {
        await connection.close();
        console.log(`Closed connection to ${dbName}`);
      } catch (error) {
        console.error(`Error closing connection to ${dbName}:`, error);
      }
    }
  }
};

module.exports = { protect, cleanupConnections };