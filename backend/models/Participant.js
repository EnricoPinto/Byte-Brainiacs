const mongoose = require('mongoose');

// Sub-schema for team members (used for storing teammate data on leader doc)
const memberSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: [100, 'Full name cannot exceed 100 characters'] },
  email:    { type: String, required: true, lowercase: true, trim: true, maxlength: [150, 'Email cannot exceed 150 characters'] },
  mobile:   { type: String, required: true, maxlength: [15, 'Mobile number cannot exceed 15 characters'] },
  college:  { type: String, required: true, trim: true, maxlength: [200, 'College name cannot exceed 200 characters'] },
  degree:   { type: String, required: true, trim: true, maxlength: [100, 'Degree cannot exceed 100 characters'] },
  yearOfStudy: {
    type: String,
    required: true,
    enum: {
      values: ['1st Year', '2nd Year', '3rd Year', 'Final Year', 'Postgraduate'],
      message: 'Invalid year of study. Must be one of: 1st Year, 2nd Year, 3rd Year, Final Year, Postgraduate',
    },
  },
  city:     { type: String, trim: true, maxlength: [100, 'City cannot exceed 100 characters'] },
  state:    { type: String, trim: true, maxlength: [100, 'State cannot exceed 100 characters'] },
  linkedin: { type: String, trim: true, maxlength: [300, 'LinkedIn URL cannot exceed 300 characters'] },
  github:   { type: String, trim: true, maxlength: [300, 'GitHub URL cannot exceed 300 characters'] },
});

const participantSchema = new mongoose.Schema(
  {
    // Personal Info (used for individual, also for team leader)
    fullName:    { type: String, required: true, trim: true, maxlength: [100, 'Full name cannot exceed 100 characters'] },
    email:       { type: String, required: true, lowercase: true, trim: true, maxlength: [150, 'Email cannot exceed 150 characters'] },
    mobile:      { type: String, required: true, maxlength: [15, 'Mobile number cannot exceed 15 characters'] },
    college:     { type: String, required: true, trim: true, maxlength: [200, 'College name cannot exceed 200 characters'] },
    degree:      { type: String, required: true, trim: true, maxlength: [100, 'Degree cannot exceed 100 characters'] },
    yearOfStudy: {
      type: String,
      required: true,
      enum: {
        values: ['1st Year', '2nd Year', '3rd Year', 'Final Year', 'Postgraduate'],
        message: 'Invalid year of study. Must be one of: 1st Year, 2nd Year, 3rd Year, Final Year, Postgraduate',
      },
    },
    city:        { type: String, trim: true, maxlength: [100, 'City cannot exceed 100 characters'] },
    state:       { type: String, trim: true, maxlength: [100, 'State cannot exceed 100 characters'] },
    linkedin:    { type: String, trim: true, maxlength: [300, 'LinkedIn URL cannot exceed 300 characters'] },
    github:      { type: String, trim: true, maxlength: [300, 'GitHub URL cannot exceed 300 characters'] },
    collegeIdUrl: { type: String }, // College ID card upload path

    // Payment Tracking (Razorpay)
    paymentStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    amount:             { type: Number },  // Dynamic amount paid (₹)
    razorpayOrderId:    { type: String },  // Store Razorpay order ID
    razorpayPaymentId:  { type: String },  // Store Razorpay payment ID

    registrationType: { type: String, enum: ['individual', 'team'], required: true },

    // Team-specific fields
    teamName:    { type: String, trim: true, maxlength: [100, 'Team name cannot exceed 100 characters'] },
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
    adminNote: { type: String, maxlength: [500, 'Admin note cannot exceed 500 characters'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Participant', participantSchema);

