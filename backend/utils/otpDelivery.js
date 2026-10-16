const nodemailer = require('nodemailer');
const twilio = require('twilio');

const emailConfigured = Boolean(
  process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.RESET_EMAIL_FROM
);

const smsConfigured = Boolean(
  process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
);

const mailTransport = emailConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

const smsClient = smsConfigured
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const sendEmailOtp = async (email, otp) => {
  if (!mailTransport) return false;
  await mailTransport.sendMail({
    from: process.env.RESET_EMAIL_FROM,
    to: email,
    subject: 'Campus Mart password reset code',
    text: `Your Campus Mart password reset code is ${otp}. It expires in 10 minutes.`,
  });
  return true;
};

const sendMobileOtp = async (phone, otp) => {
  if (!smsClient) return false;
  await smsClient.messages.create({
    body: `Your Campus Mart password reset code is ${otp}. It expires in 10 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });
  return true;
};

module.exports = { sendEmailOtp, sendMobileOtp, emailConfigured, smsConfigured };
