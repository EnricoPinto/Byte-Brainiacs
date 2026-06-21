const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'ByteBrainiacs <no-reply@bytebrainiacs.com>',
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}: ${subject}`);
  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
    // Don't throw — email failure shouldn't block API response
  }
};

const emailTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #0a0a1a; color: #e0e0e0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #12122a; border-radius: 16px; overflow: hidden; border: 1px solid rgba(99,102,241,0.3); }
    .header { background: linear-gradient(135deg, #6366f1, #06b6d4); padding: 32px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; color: #fff; font-weight: 700; }
    .header p { margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px; }
    .body { padding: 32px; }
    .body h2 { color: #6366f1; margin-top: 0; }
    .highlight { background: rgba(99,102,241,0.15); border-left: 4px solid #6366f1; padding: 16px; border-radius: 8px; margin: 16px 0; }
    .footer { text-align: center; padding: 24px; border-top: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); font-size: 12px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #6366f1, #06b6d4); color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ ByteBrainiacs</h1>
      <p>The ML Showdown Hackathon — NMCCE IT Department</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>Narsee Monjee College of Commerce and Economics | IT Department</p>
      <p>Vile Parle West, Mumbai - 400056</p>
    </div>
  </div>
</body>
</html>
`;

const sendRegistrationEmail = async (participant) => {
  await sendEmail({
    to: participant.email,
    subject: '✅ ByteBrainiacs — Registration Received!',
    html: emailTemplate(`
      <h2>Hello, ${participant.fullName}! 👋</h2>
      <p>Your registration for <strong>ByteBrainiacs: The ML Showdown</strong> has been received successfully.</p>
      <div class="highlight">
        <strong>Status: Under Review</strong><br/>
        Our team will review your application and send you an update soon.
      </div>
      <p>Thank you for your interest! Keep an eye on your inbox for further updates.</p>
    `),
  });
};

const sendTeamRegistrationEmail = async (participant, teamMembers, teamName) => {
  const memberEmails = [participant.email, ...teamMembers.map(m => m.email)].join(', ');
  await sendEmail({
    to: memberEmails,
    subject: '✅ ByteBrainiacs — Team Registration Received!',
    html: emailTemplate(`
      <h2>Hello Team ${teamName}! 👋</h2>
      <p>Your team registration for <strong>ByteBrainiacs: The ML Showdown</strong> has been received successfully.</p>
      <div class="highlight">
        <strong>Status: Under Review</strong><br/>
        Our team will review your application and send you an update soon.
      </div>
      <p>Thank you for your interest! Keep an eye on your inbox for further updates.</p>
    `),
  });
};

const sendApprovalEmail = async (participant) => {
  await sendEmail({
    to: participant.email,
    subject: '🎉 ByteBrainiacs — Application Approved!',
    html: emailTemplate(`
      <h2>Congratulations, ${participant.fullName}! 🎉</h2>
      <p>We're thrilled to inform you that your registration for <strong>ByteBrainiacs: The ML Showdown</strong> has been <strong style="color:#22c55e">APPROVED</strong>.</p>
      <div class="highlight">
        <strong>What's Next?</strong><br/>
        Our team will reach out with further event details, schedule, and venue information.
        Keep an eye on your inbox!
      </div>
      <p>Get ready to code, innovate, and showcase your ML skills! 🚀</p>
    `),
  });
};

const sendRejectionEmail = async (participant, note = '') => {
  await sendEmail({
    to: participant.email,
    subject: 'ByteBrainiacs — Application Status Update',
    html: emailTemplate(`
      <h2>Thank you for applying, ${participant.fullName}</h2>
      <p>After careful review, we regret to inform you that your application for <strong>ByteBrainiacs: The ML Showdown</strong> was <strong style="color:#ef4444">not selected</strong> for this edition.</p>
      ${note ? `<div class="highlight"><strong>Admin Note:</strong> ${note}</div>` : ''}
      <p>We appreciate your interest and encourage you to apply for future events. Stay connected with us on social media for updates!</p>
    `),
  });
};

const sendTeamAllocationEmail = async (participant, teamName, teammates) => {
  const teammateList = teammates
    .map((t) => `<li><strong>${t.fullName}</strong> — ${t.college} (${t.email})</li>`)
    .join('');
  await sendEmail({
    to: participant.email,
    subject: '⚡ ByteBrainiacs — Your Team Has Been Allocated!',
    html: emailTemplate(`
      <h2>Team Allocated: ${teamName} 🤝</h2>
      <p>Great news, <strong>${participant.fullName}</strong>! You have been allocated to a team for <strong>ByteBrainiacs: The ML Showdown</strong>.</p>
      <div class="highlight">
        <strong>Team Name:</strong> ${teamName}<br/><br/>
        <strong>Your Teammates:</strong>
        <ul>${teammateList}</ul>
      </div>
      <p>Connect with your teammates and start brainstorming! The hackathon is just around the corner. 🚀</p>
    `),
  });
};

const sendTeamApprovalEmail = async (teamName, memberEmails, memberName) => {
  await sendEmail({
    to: memberEmails,
    subject: '🎉 ByteBrainiacs — Team Approved!',
    html: emailTemplate(`
      <h2>Team <em>${teamName}</em> is Approved! 🎉</h2>
      <p>Congratulations, <strong>${memberName}</strong>! Your team <strong>${teamName}</strong> has been <strong style="color:#22c55e">APPROVED</strong> for ByteBrainiacs: The ML Showdown.</p>
      <p>Prepare yourselves — 6 hours of intense ML problem-solving awaits!</p>
    `),
  });
};

module.exports = {
  sendRegistrationEmail,
  sendTeamRegistrationEmail,
  sendApprovalEmail,
  sendRejectionEmail,
  sendTeamAllocationEmail,
  sendTeamApprovalEmail,
  sendEmail,
};
