const crypto = require('crypto');
const Participant = require('../models/Participant');
const { sendRegistrationEmail, sendTeamRegistrationEmail } = require('../utils/email');

// POST /api/payments/verify
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, participant_id } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const participant = await Participant.findByIdAndUpdate(
        participant_id,
        {
          paymentStatus: 'verified',
          razorpayPaymentId: razorpay_payment_id,
        },
        { new: true }
      );

      if (participant) {
        console.log(`✅ Payment verified for: ${participant.fullName} (${participant.email})`);
        
        // If they are part of a team, mark all teammates as verified too
        if (participant.teamId) {
          await Participant.updateMany(
            { teamId: participant.teamId },
            { paymentStatus: 'verified', razorpayPaymentId: razorpay_payment_id }
          );
        }

        if (participant.registrationType === 'individual') {
          await sendRegistrationEmail(participant);
        } else if (participant.registrationType === 'team') {
          await sendTeamRegistrationEmail(participant, participant.teamMembers, participant.teamName);
        }
      }

      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (err) {
    console.error('❌ Error verifying Razorpay payment:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/payments/status/:participantId
const getPaymentStatus = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.participantId)
      .select('fullName email paymentStatus amount registrationType teamName');
    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant not found.' });
    }
    res.json({ success: true, participant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { verifyRazorpayPayment, getPaymentStatus };
