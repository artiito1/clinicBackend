const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
// استيراد المسارات
const authRoutes = require('./src/routes/AuthRoutes');
const patientsRoutes = require('./src/routes/patientsRoutes');
const appointmentsRoutes = require('./src/routes/AppointmentRoutes');
const invoicesRoutes = require('./src/routes/InvoiceRoutes');
const connectDB = require('./src/config/database');
const doctorRoutes = require('./src/routes/DoctorRoutes');
// استيراد معالج الأخطاء العام
const globalError = require('./src/middleware/errorMiddleware');
const ApiError = require('./src/utils/apiError');

const { protect } = require('./src/middleware/authMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// استخدام morgan لتسجيل الطلبات
app.use(morgan('dev'));

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients',protect, patientsRoutes);
app.use('/api/appointments',appointmentsRoutes);
app.use('/api/invoices',protect, invoicesRoutes);
app.use('/api/doctors', doctorRoutes);
// معالج الأخطاء العام
app.use(globalError);

// معالجة المسارات غير الموجودة
app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));