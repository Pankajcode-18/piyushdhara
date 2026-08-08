const express = require('express');
const router = express.Router();

const {
  initiatePayment,
  verifyEsewaPayment,
  verifyKhaltiPayment,
  getStudentPaymentHistory,
  simulateTestPayment
} = require('../controllers/paymentController');

// Payment Endpoints
router.post('/initiate', initiatePayment);
router.post('/esewa/verify', verifyEsewaPayment);
router.post('/khalti/verify', verifyKhaltiPayment);
router.get('/my-history', getStudentPaymentHistory);

// DEV ONLY: Simulate a successful payment for local testing (bypasses real gateway)
if (process.env.NODE_ENV !== 'production') {
  router.post('/test/simulate', simulateTestPayment);
}

module.exports = router;
