const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

exports.getPatients = asyncHandler(async (req, res) => {
  const patients = await req.models.Patient.find();
  res.status(200).json(patients);
});

exports.createPatient = asyncHandler(async (req, res, next) => {
  console.log('Received patient data:', req.body);
  console.log('User data:', req.user);

  try {
    const { name, age, gender, phone, email, medicalHistory } = req.body;
    
    const patient = await req.models.Patient.create({
      name,
      age,
      gender,
      phone,
      email,
      medicalHistory
    });

    console.log('Created patient:', patient);

    if (!patient) {
      return next(new ApiError('Failed to create patient', 400));
    }
    res.status(201).json({ status: 'success', data: patient });
  } catch (error) {
    console.error('Error creating patient:', error);
    return next(new ApiError(`Failed to create patient: ${error.message}`, 500));
  }
});

exports.getPatientById = asyncHandler(async (req, res, next) => {
  const patient = await req.models.Patient.findOne({ _id: req.params.id });
  
  if (!patient) {
    return next(new ApiError('Patient not found', 404));
  }
  res.status(200).json({ status: 'success', data: patient });
});

exports.updatePatient = asyncHandler(async (req, res, next) => {
  console.log('Updating patient with ID:', req.params.id);
  console.log('Update data:', req.body);
  console.log('User data:', req.user);

  const { name, age, gender, phone, email, medicalHistory, lastVisit } = req.body;

  const patient = await req.models.Patient.findOneAndUpdate(
    { _id: req.params.id },
    { name, age, gender, phone, email, medicalHistory, lastVisit },
    { new: true, runValidators: true }
  );

  console.log('Updated patient:', patient);

  if (!patient) {
    return next(new ApiError('Patient not found', 404));
  }
  res.status(200).json({ status: 'success', data: patient });
});

exports.deletePatient = asyncHandler(async (req, res, next) => {
  const patient = await req.models.Patient.findOneAndDelete({ _id: req.params.id });

  if (!patient) {
    return next(new ApiError('Patient not found', 404));
  }
  res.status(200).json({ status: 'success', message: 'Patient removed' });
});