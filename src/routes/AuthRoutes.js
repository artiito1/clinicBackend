const express = require('express');
const { clinicLogin } = require('../controllers/AuthController');

const router = express.Router();

router.post('/login', clinicLogin);

module.exports = router;