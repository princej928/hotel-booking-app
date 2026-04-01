const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { sendResetOtpEmail } = require('../utils/mailer');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const findUserByEmail = async (email) => {
  const normalizedEmail = email?.trim().toLowerCase();
  return User.findOne({
    email: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: 'i' }
  });
};

const buildUserPayload = (user) => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
  token: generateToken(user.id),
});

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  try {
    const userExists = await findUserByEmail(normalizedEmail);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const isFirstUser = (await User.countDocuments({})) === 0;
    const user = await User.create({ name, email: normalizedEmail, password, isAdmin: isFirstUser });

    res.status(201).json(buildUserPayload(user));
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (user && (await user.matchPassword(password))) {
      res.json(buildUserPayload(user));
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({
    _id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
  });
});

// @route POST /api/auth/forgot-password/request-otp
router.post('/forgot-password/request-otp', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const mailResult = await sendResetOtpEmail({ to: user.email, otp });

    if (mailResult.delivered) {
      return res.json({ message: 'OTP sent to your email address.' });
    }

    res.json({
      message: 'OTP generated. Email delivery is not configured yet, so a development OTP is returned below.',
      devOtp: otp
    });
  } catch (error) {
    console.error('Forgot Password OTP Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/auth/forgot-password/verify-otp
router.post('/forgot-password/verify-otp', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    if (!user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ message: 'No OTP request found. Please request a new OTP.' });
    }

    if (user.resetOtp !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.resetOtpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    user.password = newPassword;
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();

    res.json({ message: 'Password updated successfully. Please log in with your new password.' });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
