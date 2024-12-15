const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const { validationResult } = require('express-validator');
const { getClinicDatabaseConnection } = require('../service/databaseConnectionService');
const { createAppointmentModel, createPatientModel } = require('../service/databaseService');

// الحصول على جميع المواعيد
exports.getAppointments = asyncHandler(async (req, res) => {
  // استخدام خدمة الاتصال بقاعدة البيانات
  const clinicDb = await getClinicDatabaseConnection(req.user.databaseName);
  // إنشاء نموذج المواعيد باستخدام قاعدة البيانات الصحيحة
  const Appointment = createAppointmentModel(clinicDb);
  // جلب المواعيد من قاعدة البيانات
  const appointments = await Appointment.find({});
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
    // استخدام خدمة الاتصال بقاعدة البيانات
    const clinicDb = await getClinicDatabaseConnection(req.user.databaseName);

    // إنشاء نموذج المواعيد ونموذج المرضى باستخدام قاعدة البيانات الصحيحة
    const Appointment = createAppointmentModel(clinicDb);
    const Patient = createPatientModel(clinicDb);

    // البحث عن المريض باستخدام الاسم ورقم الهاتف
    let patient = await Patient.findOne({ 
      name: patientName, 
      phone: phoneNumber,
      clinicId: req.user.id
    });

    // إذا لم يتم العثور على المريض، قم بإنشاء مريض جديد
    if (!patient) {
      patient = await Patient.create({
        name: patientName,
        phone: phoneNumber,
        gender,
      });
    }

    // إنشاء موعد جديد
    const newAppointment = new Appointment({
      patientName,
      phoneNumber,
      gender,
      date,
      time,
      status,
      notes,
      patientId: patient._id
    });

    await newAppointment.save();
    res.status(201).json({ status: 'success', data: newAppointment });
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
  const appointment = await req.models.Appointment.findOne({ _id: req.params.id});
  
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

  const { patientName, phoneNumber, date, time, status, notes, paidAmount, remainingAmount, previousSessions } = req.body;

  const appointment = await req.models.Appointment.findOneAndUpdate(
    { _id: req.params.id},
    { patientName, phoneNumber, date, time, status, notes, paidAmount, remainingAmount, previousSessions },
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
    _id: req.params.id
  });
  if (!appointment) {
    return res.status(404).json({ status: 'fail', message: 'Appointment not found' });
  }
  res.status(200).json({ status: 'success', data: null });
});