const express = require('express');
const router = express.Router();
const { getStats, getChartData, getActivityLogs } = require('../controllers/dashboardController');
const { protect, requireAdmin } = require('../middleware/auth');

router.get('/stats', protect, requireAdmin, getStats);
router.get('/chart-data', protect, requireAdmin, getChartData);
router.get('/activity-logs', protect, requireAdmin, getActivityLogs);

module.exports = router;
