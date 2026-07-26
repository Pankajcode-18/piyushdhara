const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';

  if (!user || !pass) {
    console.warn('⚠️ Nodemailer Warning: EMAIL_USER or EMAIL_PASS environment variables are missing.');
  }

  if (host.includes('gmail') || user?.endsWith('@gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Send 6-digit OTP email to authorized Teacher
 * @param {string} toEmail 
 * @param {string} otp 
 */
const sendTeacherOtpEmail = async (toEmail, otp) => {
  const transporter = createTransporter();
  const fromEmail = process.env.EMAIL_USER || 'noreply@piyushdhara.com';

  const mailOptions = {
    from: `"PiyushDhara Learning Portal" <${fromEmail}>`,
    to: toEmail,
    subject: '🔥 Your Teacher Access Verification Code - PiyushDhara',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #FFFFFF;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #2563EB; margin: 0;">PiyushDhara Learning Portal</h2>
          <p style="color: #64748B; font-size: 14px; margin-top: 4px;">Teacher Authentication System</p>
        </div>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
          <p style="font-size: 15px; color: #334155; margin-bottom: 12px;">Your 6-digit access OTP is:</p>
          <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #2563EB; background: #EFF6FF; padding: 12px; border-radius: 6px; display: inline-block;">
            ${otp}
          </div>
          <p style="font-size: 13px; color: #EF4444; margin-top: 14px; font-weight: 600;">
            ⏳ Code expires in 5 minutes.
          </p>
        </div>
        <p style="font-size: 12px; color: #94A3B8; text-align: center; margin: 0;">
          If you did not request this OTP, please ignore this email.
        </p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✉️ Teacher OTP email sent to ${toEmail}. Message ID: ${info.messageId}`);
  return info;
};

module.exports = {
  sendTeacherOtpEmail,
};
