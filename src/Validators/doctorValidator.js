const { check, param } = require('express-validator');
const validatorMiddleware = require('../middleware/validatorMiddleware');

exports.createDoctorValidator = [
  check('name')
    .notEmpty()
    .withMessage('Doctor name is required'),
  check('specialty')
    .notEmpty()
    .withMessage('Specialty is required'),
  check('phone')
    .notEmpty()
    .withMessage('Phone number is required'),
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  validatorMiddleware,
];

exports.getDoctorValidator = [
  param('id').isMongoId().withMessage('Invalid Doctor id format'),
  validatorMiddleware,
];

exports.updateDoctorValidator = [
  param('id').isMongoId().withMessage('Invalid Doctor id format'),
  check('name')
    .optional()
    .notEmpty()
    .withMessage('Name is required if provided'),
  check('specialty')
    .optional()
    .notEmpty()
    .withMessage('Specialty is required if provided'),
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

exports.deleteDoctorValidator = [
  param('id').isMongoId().withMessage('Invalid Doctor id format'),
  validatorMiddleware,
];
