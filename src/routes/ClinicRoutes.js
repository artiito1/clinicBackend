const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinicController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', clinicController.registerClinic);
// مسار لجلب ملف العيادة (يتطلب حماية)
router.get('/profile', protect, authorize('admin'), clinicController.getClinicProfile);
// مسار لتحديث ملف العيادة (يتطلب حماية)
router.put('/update-profile', protect, authorize('admin'), clinicController.updateClinicProfile);
// مسار لتحديث اشتراك العيادة (يتطلب حماية)
router.put('/update-subscription', protect, clinicController.updateClinicSubscription);


module.exports = router;