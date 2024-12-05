// وسيط معالجة الأخطاء العالمي
const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorForDev(err, res);
    } else {
        sendErrorForProd(err, res);
    }
};

// إرسال تفاصيل الخطأ كاملة في بيئة التطوير
const sendErrorForDev = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

// إرسال رسالة خطأ مبسطة في بيئة الإنتاج
const sendErrorForProd = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};

module.exports = globalError;