const express = require('express');
const router = express.Router();
const patientController = require('../controllers/PatientController');
const { protect } = require('../middleware/authMiddleware');
const {
  createPatientValidator,
  getPatientValidator,
  updatePatientValidator,
  deletePatientValidator
} = require('../Validators/patientValidator');

router.use(protect);

router
  .route('/')
  .get(patientController.getPatients)
  .post(createPatientValidator, patientController.createPatient);

router
  .route('/:id')
  .get(getPatientValidator, patientController.getPatientById)
  .put(updatePatientValidator, patientController.updatePatient)
  .delete(deletePatientValidator, patientController.deletePatient);

module.exports = router;