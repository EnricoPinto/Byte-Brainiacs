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

const emailStyles = {
  bodyTable: "background-color: #0a0a1a; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 40px 0; width: 100%;",
  containerTable: "max-width: 600px; background-color: #12122a; border-radius: 16px; overflow: hidden; border: 1px solid #312e81; border-collapse: collapse;",
  headerTd: "background: linear-gradient(135deg, #6366f1, #06b6d4); padding: 32px; text-align: center;",
  headerH1: "margin: 0; font-size: 28px; color: #ffffff; font-weight: 700; font-family: 'Segoe UI', Arial, sans-serif;",
  headerP: "margin: 8px 0 0; color: #e2e8f0; font-size: 14px; font-family: 'Segoe UI', Arial, sans-serif;",
  bodyTd: "padding: 32px; color: #cbd5e1; font-size: 16px; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif;",
  footerTd: "text-align: center; padding: 24px; border-top: 1px solid #1e1b4b; color: #94a3b8; font-size: 12px; font-family: 'Segoe UI', Arial, sans-serif;",
  footerP: "margin: 0 0 8px; color: #94a3b8; font-family: 'Segoe UI', Arial, sans-serif;",
  
  // Element styles
  h2: "color: #818cf8; margin-top: 0; font-family: 'Segoe UI', Arial, sans-serif; font-size: 20px; font-weight: 600; line-height: 1.4;",
  p: "color: #cbd5e1; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;",
  strong: "color: #ffffff; font-weight: 600;",
  highlight: "background-color: rgba(99, 102, 241, 0.15); border-left: 4px solid #6366f1; padding: 16px; border-radius: 8px; margin: 20px 0; color: #cbd5e1; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; line-height: 1.5;",
  ul: "color: #cbd5e1; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; margin: 12px 0; padding-left: 20px; line-height: 1.6;",
  li: "margin-bottom: 8px; color: #cbd5e1;",
};

const emailTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin: 0; padding: 0;">
  <table border="0" cellspacing="0" cellpadding="0" style="${emailStyles.bodyTable}">
    <tr>
      <td align="center">
        <table border="0" cellspacing="0" cellpadding="0" style="${emailStyles.containerTable}">
          <!-- Header -->
          <tr>
            <td style="${emailStyles.headerTd}">
              <h1 style="${emailStyles.headerH1}">⚡ ByteBrainiacs</h1>
              <p style="${emailStyles.headerP}">The ML Showdown Hackathon — NMCCE IT Department</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="${emailStyles.bodyTd}">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="${emailStyles.footerTd}">
              <p style="${emailStyles.footerP}">Narsee Monjee College of Commerce and Economics | IT Department</p>
              <p style="margin: 0; color: #94a3b8; font-family: 'Segoe UI', Arial, sans-serif;">Vile Parle West, Mumbai - 400056</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const sendRegistrationEmail = async (participant) => {
  await sendEmail({
    to: participant.email,
    subject: '✅ ByteBrainiacs — Registration Received!',
    html: emailTemplate(`
      <h2 style="${emailStyles.h2}">Hello, ${participant.fullName}! 👋</h2>
      <p style="${emailStyles.p}">Your registration for <strong style="${emailStyles.strong}">ByteBrainiacs: The ML Showdown</strong> has been received successfully.</p>
      <div style="${emailStyles.highlight}">
        <strong style="${emailStyles.strong}">Status: Under Review</strong><br/>
        Our team will review your application and send you an update soon.
      </div>
      <p style="${emailStyles.p}">Thank you for your interest! Keep an eye on your inbox for further updates.</p>
    `),
  });
};

const sendTeamRegistrationEmail = async (participant, teamMembers, teamName) => {
  const memberEmails = [participant.email, ...teamMembers.map(m => m.email)].join(', ');
  await sendEmail({
    to: memberEmails,
    subject: '✅ ByteBrainiacs — Team Registration Received!',
    html: emailTemplate(`
      <h2 style="${emailStyles.h2}">Hello Team ${teamName}! 👋</h2>
      <p style="${emailStyles.p}">Your team registration for <strong style="${emailStyles.strong}">ByteBrainiacs: The ML Showdown</strong> has been received successfully.</p>
      <div style="${emailStyles.highlight}">
        <strong style="${emailStyles.strong}">Status: Under Review</strong><br/>
        Our team will review your application and send you an update soon.
      </div>
      <p style="${emailStyles.p}">Thank you for your interest! Keep an eye on your inbox for further updates.</p>
    `),
  });
};

const sendApprovalEmail = async (participant) => {
  await sendEmail({
    to: participant.email,
    subject: '🎉 ByteBrainiacs — Application Approved!',
    html: emailTemplate(`
      <h2 style="${emailStyles.h2}">Congratulations, ${participant.fullName}! 🎉</h2>
      <p style="${emailStyles.p}">We're thrilled to inform you that your registration for <strong style="${emailStyles.strong}">ByteBrainiacs: The ML Showdown</strong> has been <strong style="color:#22c55e; font-weight:700;">APPROVED</strong>.</p>
      <div style="${emailStyles.highlight}">
        <strong style="${emailStyles.strong}">What's Next?</strong><br/>
        Our team will reach out with further event details, schedule, and venue information.
        Keep an eye on your inbox!
      </div>
      <p style="${emailStyles.p}">Get ready to code, innovate, and showcase your ML skills! 🚀</p>
    `),
  });
};

// GAP 4 FIX: Escape HTML in any admin-provided text before injecting into email
const escapeEmailHtml = (text) => {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const sendRejectionEmail = async (participant, note = '') => {
  const safeNote = escapeEmailHtml(note);
  await sendEmail({
    to: participant.email,
    subject: 'ByteBrainiacs — Application Status Update',
    html: emailTemplate(`
      <h2 style="${emailStyles.h2}">Thank you for applying, ${participant.fullName}</h2>
      <p style="${emailStyles.p}">After careful review, we regret to inform you that your application for <strong style="${emailStyles.strong}">ByteBrainiacs: The ML Showdown</strong> was <strong style="color:#ef4444; font-weight:700;">not selected</strong> for this edition.</p>
      ${safeNote ? `<div style="${emailStyles.highlight}"><strong style="${emailStyles.strong}">Admin Note:</strong> ${safeNote}</div>` : ''}
      <p style="${emailStyles.p}">We appreciate your interest and encourage you to apply for future events. Stay connected with us on social media for updates!</p>
    `),
  });
};

const sendTeamAllocationEmail = async (participant, teamName, teammates) => {
  const teammateList = teammates
    .map((t) => `<li style="${emailStyles.li}"><strong style="${emailStyles.strong}">${t.fullName}</strong> — ${t.college} (${t.email})</li>`)
    .join('');
  await sendEmail({
    to: participant.email,
    subject: '⚡ ByteBrainiacs — Your Team Has Been Allocated!',
    html: emailTemplate(`
      <h2 style="${emailStyles.h2}">Team Allocated: ${teamName} 🤝</h2>
      <p style="${emailStyles.p}">Great news, <strong style="${emailStyles.strong}">${participant.fullName}</strong>! You have been allocated to a team for <strong style="${emailStyles.strong}">ByteBrainiacs: The ML Showdown</strong>.</p>
      <div style="${emailStyles.highlight}">
        <strong style="${emailStyles.strong}">Team Name:</strong> ${teamName}<br/><br/>
        <strong style="${emailStyles.strong}">Your Teammates:</strong>
        <ul style="${emailStyles.ul}">${teammateList}</ul>
      </div>
      <p style="${emailStyles.p}">Connect with your teammates and start brainstorming! The hackathon is just around the corner. 🚀</p>
    `),
  });
};

const sendTeamApprovalEmail = async (teamName, memberEmails, memberName) => {
  await sendEmail({
    to: memberEmails,
    subject: '🎉 ByteBrainiacs — Team Approved!',
    html: emailTemplate(`
      <h2 style="${emailStyles.h2}">Team <em style="font-style: italic; color: #818cf8;">${teamName}</em> is Approved! 🎉</h2>
      <p style="${emailStyles.p}">Congratulations, <strong style="${emailStyles.strong}">${memberName}</strong>! Your team <strong style="${emailStyles.strong}">${teamName}</strong> has been <strong style="color:#22c55e; font-weight:700;">APPROVED</strong> for ByteBrainiacs: The ML Showdown.</p>
      <p style="${emailStyles.p}">Prepare yourselves — 6 hours of intense ML problem-solving awaits!</p>
    `),
  });
};

const sendTeamRemovalEmail = async (participant, teamName) => {
  await sendEmail({
    to: participant.email,
    subject: 'ByteBrainiacs — Team Update',
    html: emailTemplate(`
      <h2 style="${emailStyles.h2}">Team Update ℹ️</h2>
      <p style="${emailStyles.p}">Hello <strong style="${emailStyles.strong}">${participant.fullName}</strong>,</p>
      <p style="${emailStyles.p}">You have been removed from <strong style="${emailStyles.strong}">${teamName}</strong> by an administrator.</p>
      <p style="${emailStyles.p}">You have been returned to the unallocated participants pool. The administration team will allocate you to a new team shortly.</p>
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
  sendTeamRemovalEmail,
  sendEmail,
};
