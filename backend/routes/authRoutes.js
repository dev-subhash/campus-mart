const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  logout,
  getMe,
  requestPasswordReset,
  verifyPasswordReset,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('phone')
      .matches(/^\+?[1-9][\d\s()-]{9,18}$/)
      .withMessage('A valid mobile number is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register
);

router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('A valid email is required'),
  ],
  validate,
  requestPasswordReset
);

router.post(
  '/forgot-password/verify',
  [
    body('resetId').isMongoId().withMessage('Invalid reset session'),
    body('emailOtp').isNumeric().isLength({ min: 6, max: 6 }).withMessage('Email code must be 6 digits'),
  ],
  validate,
  verifyPasswordReset
);

router.post(
  '/forgot-password/reset',
  [
    body('resetId').isMongoId().withMessage('Invalid reset session'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  resetPassword
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
