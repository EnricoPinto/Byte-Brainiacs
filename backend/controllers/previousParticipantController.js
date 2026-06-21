const PreviousParticipant = require('../models/PreviousParticipant');

// GET /api/previous-participants
const getAll = async (req, res) => {
  try {
    const { year, college, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (year) filter.year = parseInt(year);
    if (college) filter.college = { $regex: college, $options: 'i' };
    if (search) {
      filter.$or = [
        { teamName: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
        { participantNames: { $elemMatch: { $regex: search, $options: 'i' } } },
      ];
    }
    const total = await PreviousParticipant.countDocuments(filter);
    const records = await PreviousParticipant.find(filter)
      .sort({ year: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({ success: true, total, page: parseInt(page), records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/previous-participants
const create = async (req, res) => {
  try {
    const record = await PreviousParticipant.create(req.body);
    res.status(201).json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/previous-participants/:id
const update = async (req, res) => {
  try {
    const record = await PreviousParticipant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found.' });
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/previous-participants/:id
const remove = async (req, res) => {
  try {
    await PreviousParticipant.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Record deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET distinct years & colleges for filters
const getFilters = async (req, res) => {
  try {
    const years = await PreviousParticipant.distinct('year');
    const colleges = await PreviousParticipant.distinct('college');
    res.json({ success: true, years: years.sort((a, b) => b - a), colleges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, create, update, remove, getFilters };
