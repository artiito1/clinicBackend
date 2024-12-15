const { check, param } = require('express-validator');
const validatorMiddleware = require('../middleware/validatorMiddleware');

exports.createInvoiceValidator = [
  check('invoiceNumber')
    .notEmpty()
    .withMessage('Invoice number is required'),
  check('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  check('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isNumeric()
    .withMessage('Amount must be a number'),
  check('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['clinic', 'patient'])
    .withMessage('Type must be either clinic or patient'),
  check('description')
    .optional()
    .notEmpty()
    .withMessage('Description cannot be empty'),
  check('patientName')
    .optional()
    .notEmpty()
    .withMessage('Patient name cannot be empty'),
  check('status')
    .optional()
    .isIn(['paid', 'unpaid', 'partially paid'])
    .withMessage('Invalid status'),
  validatorMiddleware,
];

exports.getInvoiceValidator = [
  param('id').isMongoId().withMessage('Invalid Invoice id format'),
  validatorMiddleware,
];

exports.updateInvoiceValidator = [
  param('id').isMongoId().withMessage('Invalid Invoice id format'),
  check('invoiceNumber')
    .optional()
    .notEmpty()
    .withMessage('Invoice number cannot be empty'),
  check('description')
    .optional()
    .notEmpty()
    .withMessage('Description cannot be empty'),
  check('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  check('amount')
    .optional()
    .isNumeric()
    .withMessage('Amount must be a number'),
  check('type')
    .optional()
    .isIn(['clinic', 'patient'])
    .withMessage('Type must be either clinic or patient'),
  check('status')
    .optional()
    .isIn(['paid', 'unpaid', 'partially paid'])
    .withMessage('Invalid status'),
  validatorMiddleware,
];

exports.deleteInvoiceValidator = [
  param('id').isMongoId().withMessage('Invalid Invoice id format'),
  validatorMiddleware,
];