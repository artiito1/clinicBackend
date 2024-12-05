const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

// الحصول على جميع المواعيد
exports.getAppointments = asyncHandler(async (req, res) => {
  console.log('Fetching appointments for clinic:', req.user.id);
  const appointments = await req.models.Appointment.find({ clinicId: req.user.id });
  console.log('Fetched appointments:', appointments);
  res.status(200).json({ status: 'success', data: appointments });
});

// إنشاء موعد جديد
exports.createAppointment = asyncHandler(async (req, res, next) => {
  console.log('Received appointment data:', req.body);
  console.log('User:', req.user);

  // التحقق من صحة البيانات
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.user || !req.user.id) {
    return next(new ApiError('User not authenticated', 401));
  }

  const { patientName, phoneNumber, gender, date, time, status, notes } = req.body;
  
  try {
    // البحث عن المريض باستخدام الاسم ورقم الهاتف
    let patient = await req.models.Patient.findOne({ 
      name: patientName, 
      phone: phoneNumber,
      clinicId: req.user.id
    });

    // إذا لم يتم العثور على المريض، قم بإنشاء مريض جديد
    if (!patient) {
      patient = await req.models.Patient.create({
        name: patientName,
        phone: phoneNumber,
        gender,
        clinicId: req.user.id,
      });
      console.log('New patient created:', patient);
    } else if (patient.gender !== gender) {
      // إذا وجد المريض ولكن الجنس مختلف، قم بتحديثه
      patient.gender = gender;
      await patient.save();
      console.log('Patient gender updated:', patient);
    }

    const appointmentData = {
      patientName,
      patientId: patient._id,
      phoneNumber,
      date,
      time,
      status,
      notes,
      clinicId: req.user.id
    };

    const appointment = await req.models.Appointment.create(appointmentData);

    console.log('Appointment created successfully:', appointment);
    res.status(201).json({ status: 'success', data: appointment });
  } catch (error) {
    console.error('Error creating appointment:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.log('Mongoose validation errors:', validationErrors);
      return next(new ApiError(`Validation failed: ${validationErrors.join(', ')}`, 400));
    }
    return next(new ApiError(`Failed to create appointment: ${error.message}`, 500));
  }
});

// الحصول على موعد محدد
exports.getAppointmentById = asyncHandler(async (req, res, next) => {
  const appointment = await req.models.Appointment.findOne({ _id: req.params.id, clinicId: req.user.clinicId });
  
  if (!appointment) {
    return next(new ApiError('Appointment not found', 404));
  }
  res.status(200).json({ status: 'success', data: appointment });
});

// تحديث موعد
exports.updateAppointment = asyncHandler(async (req, res, next) => {
  console.log('Updating appointment with ID:', req.params.id);
  console.log('Update data:', req.body);
  console.log('User data:', req.user);

  const { patientName, phoneNumber, date, time, status, notes } = req.body;

  const appointment = await req.models.Appointment.findOneAndUpdate(
    { _id: req.params.id, clinicId: req.user.id }, // تغيير من req.user.clinicId إلى req.user.id
    { patientName, phoneNumber, date, time, status, notes },
    { new: true, runValidators: true }
  );

  console.log('Updated appointment:', appointment);

  if (!appointment) {
    return next(new ApiError('Appointment not found', 404));
  }
  res.status(200).json({ status: 'success', data: appointment });
});

// حذف موعد
exports.deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await req.models.Appointment.findOneAndDelete({ 
    _id: req.params.id, 
    clinicId: req.user.id 
  });

  if (!appointment) {
    return res.status(404).json({ status: 'fail', message: 'Appointment not found' });
  }

  res.status(200).json({ status: 'success', data: null });
});