const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/email');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields (Name, Email, Message).' });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@bytebrainiacs.com';

    await sendEmail({
      to: adminEmail,
      subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>New Message from ${name}</h2>
          <p><strong>Sender Email:</strong> ${email}</p>
          <hr />
          <h3>Message:</h3>
          <p style="white-space: pre-wrap; background: #f4f4f5; padding: 16px; border-radius: 8px;">${message}</p>
        </div>
      `
    });

    res.json({ success: true, message: 'Your message has been sent successfully!' });
  } catch (err) {
    console.error('Contact Form Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
