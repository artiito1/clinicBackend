const mongoose = require('mongoose');
const Clinic = require('../models/clinicModel');
const ClinicUser = require('../models/clinicUserModel');
const databaseService = require('../services/databaseService');

// Function to register a clinic
exports.registerClinic = async (req, res) => {
  const mainSession = await mongoose.startSession();
  mainSession.startTransaction();

  try {
    const { name, email, password, clinicName, country, city, address, phone, specialization,subscriptionPlan } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password || !clinicName || !country || !city || !address || !phone || !specialization) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!subscriptionPlan) {
      return res.status(400).json({ message: 'Subscription plan is required' });
    }

    // تحقق من صحة ObjectId لخطة الاشتراك
    if (!mongoose.Types.ObjectId.isValid(subscriptionPlan)) {
      return res.status(400).json({ message: 'Invalid subscription plan ID' });
    }
    // Create the clinic in the main database
    const clinic = new Clinic({
      clinicName,
      email,
      country,
      city,
      address,
      phone,
      specialization,
      status: 'active',
      subscriptionType: 'subscription',
      subscriptionPlan: subscriptionPlan
    });

    await clinic.createDatabase(databaseService);
    await clinic.save({ session: mainSession });

    const adminUser = new ClinicUser({
      name,
      email,
      password,
      role: 'admin',
      clinicName: clinic.clinicName,
      databaseName: clinic.databaseName
    });

    await adminUser.save({ session: mainSession });

    await mainSession.commitTransaction();
    mainSession.endSession();

    // Send a success response with clinic details
    res.status(201).json({ 
      message: 'Clinic registered successfully', 
      clinicId: clinic._id,
      databaseName: clinic.databaseName
    });

  } catch (error) {
    await mainSession.abortTransaction();
    mainSession.endSession();
    console.error('Error in registerClinic:', error);
    // Send an error response in case of failure
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'A clinic with this email or name already exists' 
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error', 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });  
  }
};

// Function to get clinic profile
exports.getClinicProfile = async (req, res) => {
    console.log('getClinicProfile called');
    console.log('User:', req.user);
    try {
      const clinic = await Clinic.findOne({ clinicName: req.user.clinicName });
      console.log('Found clinic:', clinic);
      if (!clinic) {
        // Send an error response if clinic is not found
        return res.status(404).json({ message: 'Clinic not found' });
      }
      // Send the clinic profile as a response
      res.json(clinic);
    } catch (error) {
      console.error('Error in getClinicProfile:', error);
      // Send an error response in case of failure
      res.status(500).json({ message: error.message });
    }
};
  
// Function to update clinic profile
exports.updateClinicProfile = async (req, res) => {
    try {
      const { clinicName, specialization, address, city, country, description, clinicImage } = req.body;
      // Update clinic profile with the provided fields
      const clinic = await Clinic.findOneAndUpdate(
        { clinicName: req.user.clinicName },
        { clinicName, specialization, address, city, country, description, clinicImage },
        { new: true, runValidators: true }
      );
      if (!clinic) {
        // Send an error response if clinic is not found
        return res.status(404).json({ message: 'Clinic not found' });
      }
      // Send the updated clinic profile as a response
      res.json(clinic);
    } catch (error) {
      // Send an error response in case of validation or update failure
      res.status(400).json({ message: error.message });
    }
};

// Function to update clinic subscription
exports.updateClinicSubscription = async (req, res) => {
  try {
    const { subscriptionPlanId } = req.body;
    const clinic = await Clinic.findOne({ clinicName: req.user.clinicName });
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    const subscriptionPlan = await SubscriptionPlan.findById(subscriptionPlanId);
    if (!subscriptionPlan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }

    clinic.subscriptionPlan = subscriptionPlan._id;
    clinic.subscriptionEndDate = new Date(Date.now() + subscriptionPlan.duration * 24 * 60 * 60 * 1000); // Calculate end date
    await clinic.save();

    res.json(clinic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};