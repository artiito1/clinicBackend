const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

exports.getDoctors = asyncHandler(async (req, res) => {
  const doctors = await req.models.Doctor.find();
  res.status(200).json(doctors);
});

exports.createDoctor = asyncHandler(async (req, res, next) => {
  console.log('Received doctor data:', req.body);

  try {
    const { name, specialty, phone, email } = req.body;
    
    const doctor = await req.models.Doctor.create({
      name,
      specialty,
      phone,
      email
    });

    console.log('Created doctor:', doctor);

    if (!doctor) {
      return next(new ApiError('Failed to create doctor', 400));
    }
    res.status(201).json({ status: 'success', data: doctor });
  } catch (error) {
    console.error('Error creating doctor:', error);
    return next(new ApiError(`Failed to create doctor: ${error.message}`, 500));
  }
});

exports.getDoctorById = asyncHandler(async (req, res, next) => {
  const doctor = await req.models.Doctor.findOne({ _id: req.params.id });
  
  if (!doctor) {
    return next(new ApiError('Doctor not found', 404));
  }
  res.status(200).json({ status: 'success', data: doctor });
});

exports.updateDoctor = asyncHandler(async (req, res, next) => {
  console.log('Updating doctor with ID:', req.params.id);
  console.log('Update data:', req.body);

  const { name, specialty, phone, email } = req.body;

  const doctor = await req.models.Doctor.findOneAndUpdate(
    { _id: req.params.id },
    { name, specialty, phone, email },
    { new: true, runValidators: true }
  );

  console.log('Updated doctor:', doctor);

  if (!doctor) {
    return next(new ApiError('Doctor not found', 404));
  }
  res.status(200).json({ status: 'success', data: doctor });
});

exports.deleteDoctor = asyncHandler(async (req, res, next) => {
  const doctor = await req.models.Doctor.findOneAndDelete({ _id: req.params.id });

  if (!doctor) {
    return next(new ApiError('Doctor not found', 404));
  }
  res.status(200).json({ status: 'success', message: 'Doctor removed' });
});