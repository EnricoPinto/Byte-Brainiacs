const express = require('express');
const router = express.Router();
const {
  registerParticipant,
  getParticipants,
  getParticipantById,
  updateParticipantStatus,
  exportParticipants,
} = require('../controllers/participantController');
const { protect, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.post('/register', upload.fields([
  { name: 'collegeId', maxCount: 1 },
]), registerParticipant);

// Admin only
router.get('/', protect, requireAdmin, getParticipants);
router.get('/export', protect, requireAdmin, exportParticipants);
router.get('/:id', protect, requireAdmin, getParticipantById);
router.patch('/:id/status', protect, requireAdmin, updateParticipantStatus);

module.exports = router;
