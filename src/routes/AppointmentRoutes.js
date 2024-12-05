const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/AppointmentController');
const { protect } = require('../middleware/authMiddleware');
const {
  createAppointmentValidator,
  getAppointmentValidator,
  updateAppointmentValidator,
  deleteAppointmentValidator
} = require('../validators/appointmentValidator');

// استخدم verifyClinic لجميع مسارات المواعيد
router.use(protect);

router
  .route('/')
  .get(appointmentController.getAppointments)
  .post(createAppointmentValidator, appointmentController.createAppointment);

router
  .route('/:id')
  .get(getAppointmentValidator, appointmentController.getAppointmentById)
  .put(updateAppointmentValidator, appointmentController.updateAppointment)
  .delete(deleteAppointmentValidator, appointmentController.deleteAppointment);

module.exports = router;
