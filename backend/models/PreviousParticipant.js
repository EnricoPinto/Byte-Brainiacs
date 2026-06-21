const mongoose = require('mongoose');

const previousParticipantSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    teamName: { type: String, required: true, trim: true },
    participantNames: [{ type: String, trim: true }],
    college: { type: String, required: true, trim: true },
    achievement: { type: String, trim: true }, // e.g. "Winner", "Runner-Up", "Participant"
    projectTitle: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PreviousParticipant', previousParticipantSchema);
