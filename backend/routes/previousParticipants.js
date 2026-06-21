const express = require('express');
const router = express.Router();
const {
  getAll,
  create,
  update,
  remove,
  getFilters,
} = require('../controllers/previousParticipantController');
const { protect, requireAdmin } = require('../middleware/auth');

router.get('/', getAll); // public
router.get('/filters', getFilters); // public
router.post('/', protect, requireAdmin, create);
router.put('/:id', protect, requireAdmin, update);
router.delete('/:id', protect, requireAdmin, remove);

module.exports = router;
