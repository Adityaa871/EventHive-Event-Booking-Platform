const nodemailer = require('nodemailer');

// Initialize transporter using environment variables or a fallback ethereal test account
let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  } else {
    // When SMTP credentials are not configured, log cleanly instead of failing
    transporter = {
      sendMail: async (options) => {
        console.log(`[Email Service - Simulated] To: ${options.to} | Subject: ${options.subject}`);
        return { messageId: 'simulated-' + Date.now() };
      },
    };
  }
  return transporter;
};

// Base HTML layout template
const emailLayout = (title, content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafafa; margin: 0; padding: 24px; color: #18181b; }
    .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden; }
    .header { background-color: #18181b; color: #ffffff; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
    .content { padding: 32px 24px; line-height: 1.6; font-size: 14px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
    .info-table td { padding: 10px 12px; border-bottom: 1px solid #f4f4f5; }
    .info-table td:first-child { color: #71717a; width: 38%; font-weight: 500; }
    .info-table td:last-child { color: #09090b; font-weight: 600; }
    .footer { background-color: #f4f4f5; padding: 16px 24px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #e4e4e7; }
    .badge { display: inline-block; padding: 4px 8px; font-size: 11px; font-weight: 600; text-transform: uppercase; border-radius: 4px; background: #eff6ff; color: #1d4ed8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>EventHive</h1>
    </div>
    <div class="content">
      <h2 style="font-size: 18px; margin-top: 0; color: #09090b;">${title}</h2>
      ${content}
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} EventHive. All rights reserved.<br>
      High-touch event planning and tailored occasion packages.
    </div>
  </div>
</body>
</html>
`;

/**
 * Send an email safely with try/catch to avoid breaking user flows
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailClient = getTransporter();
    const from = process.env.EMAIL_FROM || '"EventHive Concierge" <noreply@eventhive.com>';
    return await mailClient.sendMail({ from, to, subject, html });
  } catch (error) {
    console.error('[Email Service Error]', error.message);
    return null;
  }
};

/**
 * 1. Booking successfully submitted
 */
const sendBookingSubmitted = async (booking) => {
  const dateFormatted = new Date(booking.eventDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const content = `
    <p>Dear <strong>${booking.name}</strong>,</p>
    <p>Thank you for submitting your event booking request with EventHive. We have received your inquiry and our event management team is reviewing the logistics.</p>
    
    <table class="info-table">
      <tr><td>Event Occasion</td><td>${booking.eventType}</td></tr>
      <tr><td>Scheduled Date</td><td>${dateFormatted}</td></tr>
      <tr><td>Guest Count</td><td>${booking.guestCount} guests</td></tr>
      <tr><td>Package Ref</td><td>${booking.packageName || booking.package?.title || 'Custom Inclusions'}</td></tr>
      <tr><td>Status</td><td><span class="badge">Pending Review</span></td></tr>
    </table>

    <p>We will contact you shortly via phone (${booking.phone}) or email to finalize details and confirm your reservation.</p>
    <p>Warm regards,<br>The EventHive Planning Team</p>
  `;

  return sendEmail({
    to: booking.email,
    subject: `Booking Request Received – EventHive [${booking._id.toString().slice(-6).toUpperCase()}]`,
    html: emailLayout('Your Booking Request is Under Review', content),
  });
};

/**
 * 2. Admin confirms a booking
 */
const sendBookingConfirmed = async (booking) => {
  const dateFormatted = new Date(booking.eventDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const content = `
    <p>Dear <strong>${booking.name}</strong>,</p>
    <p>Great news! Your booking for <strong>${booking.eventType}</strong> on <strong>${dateFormatted}</strong> has been officially <span style="color: #15803d; font-weight: bold;">CONFIRMED</span>.</p>
    
    <table class="info-table">
      <tr><td>Invoice Number</td><td>${booking.invoiceNumber || 'Generated upon confirmation'}</td></tr>
      <tr><td>Event Date</td><td>${dateFormatted}</td></tr>
      <tr><td>Package</td><td>${booking.packageName || booking.package?.title || 'Custom'}</td></tr>
      <tr><td>Total Price</td><td>₹${(booking.priceDetails?.finalPrice || booking.budget || 0).toLocaleString('en-IN')}</td></tr>
      <tr><td>Status</td><td><span class="badge" style="background:#f0fdf4; color:#15803d;">Confirmed</span></td></tr>
    </table>

    <p>You can access your booking details and download your official invoice anytime from your EventHive dashboard.</p>
    <p>Best regards,<br>EventHive Team</p>
  `;

  return sendEmail({
    to: booking.email,
    subject: `Booking Confirmed! – EventHive [${booking._id.toString().slice(-6).toUpperCase()}]`,
    html: emailLayout('Your Booking is Confirmed', content),
  });
};

/**
 * 3. Booking cancelled or rejected
 */
const sendBookingCancelled = async (booking, reason = '') => {
  const content = `
    <p>Dear <strong>${booking.name}</strong>,</p>
    <p>This is to notify you that your booking request for <strong>${booking.eventType}</strong> has been cancelled.</p>
    ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
    <p>If you believe this is in error or would like to discuss alternative event dates or packages, please contact our support team.</p>
    <p>Best regards,<br>EventHive Team</p>
  `;

  return sendEmail({
    to: booking.email,
    subject: `Booking Update: Cancellation Notice – EventHive`,
    html: emailLayout('Booking Cancelled', content),
  });
};

/**
 * 4. Cancellation request approved or rejected
 */
const sendCancellationReviewed = async (booking, approved, reason = '') => {
  const statusText = approved ? 'Approved' : 'Declined';
  const content = `
    <p>Dear <strong>${booking.name}</strong>,</p>
    <p>Your request to cancel booking ref <strong>#${booking._id.toString().slice(-6).toUpperCase()}</strong> has been <strong>${statusText.toUpperCase()}</strong> by our admin team.</p>
    ${reason ? `<p><strong>Admin Note:</strong> ${reason}</p>` : ''}
    <p>If you have questions, please reach out to our concierge desk.</p>
    <p>Warm regards,<br>EventHive Team</p>
  `;

  return sendEmail({
    to: booking.email,
    subject: `Cancellation Request ${statusText} – EventHive`,
    html: emailLayout(`Cancellation Request ${statusText}`, content),
  });
};

/**
 * 5. Rescheduling request approved or rejected
 */
const sendRescheduleReviewed = async (booking, approved, newDate, reason = '') => {
  const statusText = approved ? 'Approved' : 'Declined';
  const formattedNewDate = newDate ? new Date(newDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '';

  const content = `
    <p>Dear <strong>${booking.name}</strong>,</p>
    <p>Your request to reschedule booking ref <strong>#${booking._id.toString().slice(-6).toUpperCase()}</strong> has been <strong>${statusText.toUpperCase()}</strong>.</p>
    ${approved ? `<p>Your event is now scheduled for: <strong>${formattedNewDate}</strong>.</p>` : ''}
    ${reason ? `<p><strong>Admin Note:</strong> ${reason}</p>` : ''}
    <p>Thank you for choosing EventHive.</p>
    <p>Warm regards,<br>EventHive Team</p>
  `;

  return sendEmail({
    to: booking.email,
    subject: `Reschedule Request ${statusText} – EventHive`,
    html: emailLayout(`Reschedule Request ${statusText}`, content),
  });
};

/**
 * 6. Event reminder
 */
const sendUpcomingReminder = async (booking) => {
  const dateFormatted = new Date(booking.eventDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const content = `
    <p>Dear <strong>${booking.name}</strong>,</p>
    <p>This is a friendly reminder that your event <strong>${booking.eventType}</strong> is coming up soon on <strong>${dateFormatted}</strong>.</p>
    <p>Our coordinators are putting final touches on your arrangement. If you need any last-minute adjustments, please get in touch.</p>
    <p>We look forward to hosting an unforgettable occasion!</p>
    <p>Warm regards,<br>EventHive Team</p>
  `;

  return sendEmail({
    to: booking.email,
    subject: `Upcoming Event Reminder – EventHive`,
    html: emailLayout('Your Event is Approaching!', content),
  });
};

module.exports = {
  sendBookingSubmitted,
  sendBookingConfirmed,
  sendBookingCancelled,
  sendCancellationReviewed,
  sendRescheduleReviewed,
  sendUpcomingReminder,
};
