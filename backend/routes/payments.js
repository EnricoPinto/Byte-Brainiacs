const express = require('express');
const router = express.Router();
const { verifyRazorpayPayment, getPaymentStatus } = require('../controllers/paymentController');

// POST /api/payments/verify
router.post('/verify', verifyRazorpayPayment);

// Public — check payment status
router.get('/status/:participantId', getPaymentStatus);

module.exports = router;
