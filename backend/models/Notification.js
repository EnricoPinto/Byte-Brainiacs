const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true }, // target participant email
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['approval', 'rejection', 'team_allocation', 'info'],
      default: 'info',
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
