const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');
const PasswordReset = require('../models/PasswordReset');
const crypto = require('crypto');
const {
  sendEmailOtp,
  emailConfigured,
} = require('../utils/otpDelivery');

const normalizePhone = (phone) => phone.replace(/[\s()-]/g, '');
const createOtp = () => String(crypto.randomInt(100000, 1000000));
const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await User.create({ name, email, password, phone: phone ? normalizePhone(phone) : undefined });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    data: { user: user.toSafeObject(), token },
  });
});

// @desc    Log in a user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account has been deactivated');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    data: { user: user.toSafeObject(), token },
  });
});

// @desc    Log out (client discards token; endpoint provided for completeness/future blacklist)
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get currently logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user.toSafeObject() } });
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new ApiError(404, 'No account matches that email');

  if (process.env.NODE_ENV === 'production' && !emailConfigured) {
    throw new ApiError(503, 'Password reset delivery is not configured');
  }

  await PasswordReset.deleteMany({ user: user._id });
  const emailOtp = createOtp();
  const reset = await PasswordReset.create({
    user: user._id,
    emailOtpHash: hashOtp(emailOtp),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendEmailOtp(user.email, emailOtp);

  const response = {
    success: true,
    data: { resetId: reset._id },
    message: 'A verification code was sent to your email',
  };
  if (process.env.NODE_ENV !== 'production') {
    response.data.developmentOtps = {
      email: emailConfigured ? undefined : emailOtp,
    };
  }
  res.json(response);
});

const verifyPasswordReset = asyncHandler(async (req, res) => {
  const { resetId, emailOtp } = req.body;
  const reset = await PasswordReset.findById(resetId);
  if (!reset || reset.expiresAt < new Date()) throw new ApiError(400, 'The verification codes have expired');
  if (reset.attempts >= 5) throw new ApiError(429, 'Too many attempts. Request new codes');

  const valid = hashOtp(emailOtp) === reset.emailOtpHash;
  if (!valid) {
    reset.attempts += 1;
    await reset.save();
    throw new ApiError(400, 'Invalid email verification code');
  }

  reset.verified = true;
  await reset.save();
  res.json({ success: true, data: { resetId: reset._id } });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { resetId, password } = req.body;
  const reset = await PasswordReset.findOne({ _id: resetId, verified: true });
  if (!reset || reset.expiresAt < new Date()) throw new ApiError(400, 'The password reset session has expired');

  const user = await User.findById(reset.user);
  user.password = password;
  await user.save();
  await PasswordReset.deleteOne({ _id: reset._id });
  res.json({ success: true, message: 'Password changed successfully' });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  requestPasswordReset,
  verifyPasswordReset,
  resetPassword,
};
