const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/email');

// BUG 5 FIX: Helper to escape HTML special characters (prevents XSS in email)
const escapeHtml = (text) => {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields (Name, Email, Message).' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    // Escape all user inputs before putting them in HTML
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@bytebrainiacs.com';

    await sendEmail({
      to: adminEmail,
      subject: `New Contact Form Submission: ${safeSubject || 'No Subject'}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>New Message from ${safeName}</h2>
          <p><strong>Sender Email:</strong> ${safeEmail}</p>
          <hr />
          <h3>Message:</h3>
          <p style="white-space: pre-wrap; background: #f4f4f5; padding: 16px; border-radius: 8px;">${safeMessage}</p>
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
