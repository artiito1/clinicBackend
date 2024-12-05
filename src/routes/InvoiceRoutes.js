const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/InvoiceController');
const { protect } = require('../middleware/authMiddleware');
const {
  createInvoiceValidator,
  getInvoiceValidator,
  updateInvoiceValidator,
  deleteInvoiceValidator
} = require('../Validators/invoiceValidator');

// استخدم verifyClinic لجميع مسارات الفواتير
router.use(protect);

// مسارات فواتير العيادة
router
  .route('/clinic')
  .get(invoiceController.getClinicInvoices)
  .post(createInvoiceValidator, invoiceController.createClinicInvoice);

// مسارات فواتير المرضى
router
  .route('/patient')
  .get(invoiceController.getPatientInvoices)
  .post(createInvoiceValidator, invoiceController.createPatientInvoice);

// مسارات عامة
router
  .route('/:id')
  .get(getInvoiceValidator, invoiceController.getInvoiceById)
  .put(updateInvoiceValidator, invoiceController.updateInvoice)
  .delete(deleteInvoiceValidator, invoiceController.deleteInvoice);

module.exports = router;