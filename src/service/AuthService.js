const ClinicUser = require('../models/clinicUserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.clinicLogin = async (email, password) => {
    const clinicUser = await ClinicUser.findOne({ email, role: 'admin' });
    if (!clinicUser) {
      throw new Error('Clinic admin not found');
    }
  
    const isMatch = await bcrypt.compare(password, clinicUser.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
  
    // Only include essential data in token
    const token = jwt.sign(
      { 
        id: clinicUser._id, 
        role: clinicUser.role, 
        databaseName: clinicUser.databaseName
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
  
    // Return minimal user info
    return { 
      token, 
      user: { 
        id: clinicUser._id,
        name: clinicUser.name,
        role: clinicUser.role,
        databaseName: clinicUser.databaseName
      } 
    };
  };