const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

exports.getClinicInvoices = asyncHandler(async (req, res) => {
  const invoices = await req.models.Invoice.find({ type: 'clinic' });
  res.status(200).json({ status: 'success', results: invoices.length, data: invoices });
});

exports.getPatientInvoices = asyncHandler(async (req, res) => {
  const invoices = await req.models.Invoice.find({ type: 'patient' });
  res.status(200).json({ status: 'success', results: invoices.length, data: invoices });
});

exports.createClinicInvoice = asyncHandler(async (req, res) => {
  console.log('Received data for clinic invoice:', req.body);
  const invoice = await req.models.Invoice.create({ ...req.body, type: 'clinic' });
  res.status(201).json({ status: 'success', data: invoice });
});

exports.createPatientInvoice = asyncHandler(async (req, res) => {
  console.log('Received data for patient invoice:', req.body);
  const invoice = await req.models.Invoice.create({ ...req.body, type: 'patient' });
  res.status(201).json({ status: 'success', data: invoice });
});

exports.getInvoices = asyncHandler(async (req, res) => {
  const invoices = await req.models.Invoice.find();
  res.status(200).json({ status: 'success', results: invoices.length, data: invoices });
});

exports.createInvoice = asyncHandler(async (req, res, next) => {
  try {
    const invoice = await req.models.Invoice.create(req.body);
    res.status(201).json({ status: 'success', data: invoice });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return next(new ApiError(`Validation failed: ${validationErrors.join(', ')}`, 400));
    }
    return next(new ApiError(`Failed to create invoice: ${error.message}`, 500));
  }
});

exports.getInvoiceById = asyncHandler(async (req, res, next) => {
  const invoice = await req.models.Invoice.findOne({ _id: req.params.id, clinicId: req.user.id });
  if (!invoice) {
    return next(new ApiError('Invoice not found', 404));
  }
  res.status(200).json({ status: 'success', data: invoice });
});

exports.updateInvoice = asyncHandler(async (req, res, next) => {
  const invoice = await req.models.Invoice.findOneAndUpdate(
    { _id: req.params.id, clinicId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!invoice) {
    return next(new ApiError('Invoice not found', 404));
  }
  res.status(200).json({ status: 'success', data: invoice });
});

exports.deleteInvoice = asyncHandler(async (req, res, next) => {
  const invoice = await req.models.Invoice.findOneAndDelete({ _id: req.params.id, clinicId: req.user.id });
  if (!invoice) {
    return next(new ApiError('Invoice not found', 404));
  }
  res.status(200).json({ status: 'success', message: 'Invoice deleted' });
});