const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true, trim: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    isAllocated: { type: Boolean, default: false }, // true = admin-allocated individual group
    createdBy: { type: String, enum: ['self', 'admin'], default: 'self' },
    adminNote: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
