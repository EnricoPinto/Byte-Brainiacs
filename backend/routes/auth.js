const express = require('express');
const router = express.Router();
const { adminLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/admin-login', adminLogin);
router.get('/me', protect, getMe);

module.exports = router;
