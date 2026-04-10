// for sending the mail to the user 
const nodemailer = require('nodemailer');

const createTransporter = async () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.log('No SMTP configuration found. Bypassing email sending to use Development OTP instantly...');
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === 'true',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
};

const sendResetOtpEmail = async ({ to, otp }) => {
  const transporter = await createTransporter();

  if (!transporter) {
    return { delivered: false };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER || '"StayScape Support" <support@ethereal.email>',
      to,
      subject: 'Your StayScape password reset OTP',
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
      html: `<p>Your OTP is <strong>${otp}</strong>.</p><p>It will expire in 10 minutes.</p>`
    });

    console.log("-----------------------------------------");
    console.log("Email sent successfully: %s", info.messageId);
    console.log("DEVELOPER TEST EMAIL PREVIEW URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("-----------------------------------------");

    return { delivered: true };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { delivered: false };
  }
};

module.exports = { sendResetOtpEmail };
