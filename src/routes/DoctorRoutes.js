const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/DoctorController');
const { protect } = require('../middleware/authMiddleware');
const {
  createDoctorValidator,
  getDoctorValidator,
  updateDoctorValidator,
  deleteDoctorValidator
} = require('../Validators/doctorValidator');

router.use(protect);

router
  .route('/')
  .get(doctorController.getDoctors)
  .post(createDoctorValidator, doctorController.createDoctor);

router
  .route('/:id')
  .get(getDoctorValidator, doctorController.getDoctorById)
  .put(updateDoctorValidator, doctorController.updateDoctor)
  .delete(deleteDoctorValidator, doctorController.deleteDoctor);

module.exports = router;