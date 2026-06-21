const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    adminName: { type: String },
    action: { type: String, required: true }, // e.g. "Approved Participant", "Allocated Team"
    targetType: { type: String, enum: ['participant', 'team', 'previousParticipant', 'system'] },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    targetName: { type: String }, // human-readable target
    details: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
