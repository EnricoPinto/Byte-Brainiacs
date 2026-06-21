const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  mobile: { type: String, required: true },
  college: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  yearOfStudy: { type: String, required: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  linkedin: { type: String, trim: true },
  github: { type: String, trim: true },
});

const participantSchema = new mongoose.Schema(
  {
    // Personal Info (used for individual, also for team leader)
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobile: { type: String, required: true },
    college: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    yearOfStudy: { type: String, required: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    collegeIdUrl: { type: String }, // College ID card upload
    
    // Payment Tracking (Razorpay)
    paymentStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    amount: { type: Number }, // Dynamic amount paid (₹)
    razorpayOrderId: { type: String }, // Store Razorpay order ID
    razorpayPaymentId: { type: String }, // Store Razorpay payment ID

    registrationType: { type: String, enum: ['individual', 'team'], required: true },

    // Team-specific fields
    teamName: { type: String, trim: true },
    teamMembers: [memberSchema],

    // Status
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'waiting_for_team'],
      default: 'pending',
    },

    // Reference to allocated/registered team
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },

    // Admin notes
    adminNote: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Participant', participantSchema);
