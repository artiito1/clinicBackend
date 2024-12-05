const { validationResult } = require('express-validator');

// وسيط للتحقق من صحة المدخلات
const validatorMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // إذا وجدت أخطاء، أرسل استجابة بالأخطاء
        return res.status(400).json({ errors: errors.array() });
    } else {
        // إذا لم توجد أخطاء، انتقل إلى الوسيط التالي
        next();
    }
};

module.exports = validatorMiddleware;