const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { signup, login } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken'); // ✅ Import middleware

// Signup
router.post('/signup', signup);

// Login
router.post('/login', login);

// ✅ Get current user (Protected)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error("Fetch User Error:", error);
    res.status(401).json({ error: 'Invalid token or not authenticated' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
  });
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
