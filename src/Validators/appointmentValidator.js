const { check, param } = require('express-validator');
const validatorMiddleware = require('../middleware/validatorMiddleware');

exports.createAppointmentValidator = [
  check('patientName').notEmpty().withMessage('Patient name is required'),
  check('phoneNumber').notEmpty().withMessage('Phone number is required'),
  check('toothNumber')
    .notEmpty()
    .withMessage('Tooth number is required')
    .isInt({ min: 1, max: 32 })
    .withMessage('Tooth number must be between 1 and 32'),
  check('treatment').notEmpty().withMessage('Treatment description is required'),
  check('cost')
    .notEmpty()
    .withMessage('Treatment cost is required')
    .isNumeric()
    .withMessage('Cost must be a number'),
  check('date')
    .notEmpty()
    .withMessage('Appointment date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  check('time')
    .notEmpty()
    .withMessage('Appointment time is required'),
  check('status')
    .optional()
    .isIn(['scheduled', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  validatorMiddleware,
];

exports.updateAppointmentValidator = [
  param('id').isMongoId().withMessage('Invalid Appointment id format'),
  check('toothNumber')
    .optional()
    .isInt({ min: 1, max: 32 })
    .withMessage('Tooth number must be between 1 and 32'),
  check('treatment')
    .optional()
    .notEmpty()
    .withMessage('Treatment description is required if provided'),
  check('cost')
    .optional()
    .isNumeric()
    .withMessage('Cost must be a number'),
  check('status')
    .optional()
    .isIn(['scheduled', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  validatorMiddleware,
];

exports.getAppointmentValidator = [
  param('id').isMongoId().withMessage('Invalid Appointment id format'),
  validatorMiddleware,
];

exports.deleteAppointmentValidator = [
  param('id').isMongoId().withMessage('Invalid Appointment id format'),
  validatorMiddleware,
];