const express = require('express');
const router = express.Router();
const {
  getTeams,
  updateTeamStatus,
  getApprovedIndividuals,
  allocateTeam,
} = require('../controllers/teamController');
const { protect, requireAdmin } = require('../middleware/auth');

router.get('/', protect, requireAdmin, getTeams);
router.get('/approved-individuals', protect, requireAdmin, getApprovedIndividuals);
router.post('/allocate', protect, requireAdmin, allocateTeam);
router.patch('/:id/status', protect, requireAdmin, updateTeamStatus);

module.exports = router;
