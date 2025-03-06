const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService');
const authMiddleware = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one uppercase letter' });
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one number' });
    }

    const token = await AuthService.register(username, email, password);
    res.json({ token });
  } catch (error) {
    if (error.message.includes('already exists')) {
      res.status(409).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if ((!username && !email) || !password) {
      return res.status(400).json({ message: 'Username/email and password are required' });
    }

    const token = await AuthService.login(username, email, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await AuthService.getProfile(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const updatedUser = await AuthService.updateProfile(req.user.id, {
      email,
      currentPassword,
      newPassword
    });
    
    // Generate new token with updated information
    const token = AuthService.generateToken(updatedUser);
    res.json({ token, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Refresh token
router.get('/refresh-token', authMiddleware, async (req, res) => {
  try {
    const user = await AuthService.getProfile(req.user.id);
    const token = AuthService.generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 