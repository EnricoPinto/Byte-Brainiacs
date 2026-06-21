const Participant = require('../models/Participant');
const Team = require('../models/Team');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const { sendApprovalEmail, sendRejectionEmail } = require('../utils/email');
const { exportParticipantsToExcel } = require('../utils/export');
const path = require('path');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/participants/register
const registerParticipant = async (req, res) => {
  try {
    const data = req.body;

    // Check for duplicate email
    const existing = await Participant.findOne({ email: data.email?.toLowerCase() });
    if (existing)
      return res.status(409).json({ success: false, message: 'This email is already registered.' });

    const participantData = {
      fullName: data.fullName,
      email: data.email?.toLowerCase(),
      mobile: data.mobile,
      college: data.college,
      degree: data.degree,
      yearOfStudy: data.yearOfStudy,
      city: data.city,
      state: data.state,
      linkedin: data.linkedin,
      github: data.github,
      registrationType: data.registrationType,
    };

    if (req.files) {
      if (req.files['collegeId']) {
        participantData.collegeIdUrl = `/uploads/${req.files['collegeId'][0].filename}`;
      }
    }
    
    // Dynamic fee calculation: ₹25 per participant
    let memberCount = 1; // leader/individual
    if (data.registrationType === 'team') {
      participantData.teamName = data.teamName;
      participantData.teamMembers = typeof data.teamMembers === 'string'
        ? JSON.parse(data.teamMembers)
        : data.teamMembers;
      memberCount = 1 + (participantData.teamMembers?.length || 0); // leader + members
      participantData.status = 'pending';
    } else {
      participantData.status = 'waiting_for_team';
    }

    participantData.amount = memberCount * 25;
    participantData.paymentStatus = 'pending';

    const participant = await Participant.create(participantData);

    // Automatically create Team and Participant records for members
    if (participantData.registrationType === 'team' && participantData.teamMembers) {
      const memberIds = [participant._id];

      for (const memberData of participantData.teamMembers) {
        const member = await Participant.create({
          fullName: memberData.fullName,
          email: memberData.email?.toLowerCase(),
          mobile: memberData.mobile,
          college: memberData.college,
          degree: memberData.degree,
          yearOfStudy: memberData.yearOfStudy,
          registrationType: 'team',
          status: 'pending',
          paymentStatus: 'pending',
          teamName: participantData.teamName,
        });
        memberIds.push(member._id);
      }

      const team = await Team.create({
        teamName: participantData.teamName,
        members: memberIds,
        status: 'pending',
        isAllocated: false,
        createdBy: 'self',
      });

      // Update all newly created participants (leader + members) with the team ID
      await Participant.updateMany(
        { _id: { $in: memberIds } },
        { teamId: team._id }
      );
      
      participant.teamId = team._id;
    }

    // Create Razorpay Order
    const options = {
      amount: participantData.amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${participant._id}`,
    };
    
    const order = await razorpay.orders.create(options);

    // Store the Razorpay order ID
    participant.razorpayOrderId = order.id;
    await participant.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful! Proceeding to payment...',
      participant,
      orderId: order.id,
      amount: options.amount,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/participants
const getParticipants = async (req, res) => {
  try {
    const { type, status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (type) filter.registrationType = type;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
        { teamName: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Participant.countDocuments(filter);
    const participants = await Participant.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('teamId', 'teamName status');

    res.json({ success: true, total, page: parseInt(page), participants });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/participants/:id
const getParticipantById = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id).populate('teamId');
    if (!participant)
      return res.status(404).json({ success: false, message: 'Participant not found.' });
    res.json({ success: true, participant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/participants/:id/status
const updateParticipantStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected', 'waiting_for_team'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status.' });

    const participant = await Participant.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true }
    );
    if (!participant)
      return res.status(404).json({ success: false, message: 'Participant not found.' });

    // Send email & notification
    if (status === 'approved') {
      await sendApprovalEmail(participant);
      await Notification.create({
        email: participant.email,
        message: `Congratulations! Your registration for ByteBrainiacs has been approved.`,
        type: 'approval',
      });
    } else if (status === 'rejected') {
      await sendRejectionEmail(participant, adminNote);
      await Notification.create({
        email: participant.email,
        message: `Your registration was not selected. ${adminNote || ''}`,
        type: 'rejection',
      });
    }

    // Log activity
    await ActivityLog.create({
      adminId: req.user._id,
      adminName: req.user.name,
      action: `${status.charAt(0).toUpperCase() + status.slice(1)} Participant`,
      targetType: 'participant',
      targetId: participant._id,
      targetName: participant.fullName,
    });

    res.json({ success: true, message: `Participant ${status}.`, participant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/participants/export
const exportParticipants = async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    if (type) filter.registrationType = type;
    if (status) filter.status = status;

    const participants = await Participant.find(filter).sort({ createdAt: -1 });
    const workbook = await exportParticipantsToExcel(participants);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=ByteBrainiacs_Participants.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  registerParticipant,
  getParticipants,
  getParticipantById,
  updateParticipantStatus,
  exportParticipants,
};
