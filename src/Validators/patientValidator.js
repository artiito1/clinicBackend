const { check, param } = require('express-validator');
const validatorMiddleware = require('../middleware/validatorMiddleware');

exports.createPatientValidator = [
  check('name')
    .notEmpty()
    .withMessage('Patient name is required'),
  check('age')
    .optional()
    .isNumeric()
    .withMessage('Age must be a number'),
  check('gender')
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['male', 'female', 'other'])
    .withMessage('Invalid gender'),
  check('phone')
    .notEmpty()
    .withMessage('Phone number is required'),
  check('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),
  validatorMiddleware,
];

exports.getPatientValidator = [
  param('id').isMongoId().withMessage('Invalid Patient id format'),
  validatorMiddleware,
];

exports.updatePatientValidator = [
  param('id').isMongoId().withMessage('Invalid Patient id format'),
  check('name')
    .optional()
    .notEmpty()
    .withMessage('Name is required if provided'),
  check('age')
    .optional()
    .isNumeric()
    .withMessage('Age must be a number'),
  check('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Invalid gender'),
  check('phone')
    .optional()
    .notEmpty()
    .withMessage('Phone number is required if provided'),
  check('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),
  validatorMiddleware,
];

exports.deletePatientValidator = [
  param('id').isMongoId().withMessage('Invalid Patient id format'),
  validatorMiddleware,
];