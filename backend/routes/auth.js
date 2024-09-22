const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

// Use a secret key for JWT (recommended to be stored securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Signup Route
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save user to the database
    await newUser.save();

    // Generate JWT Token
    const payload = {
      user: {
        id: newUser.id,
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) {
          console.error('Error signing token:', err);
          return res.status(500).json({ message: 'Error generating token' });
        }

        // Return both token and user data
        res.status(201).json({
          message: 'User registered successfully',
          token,
          user: {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
          },
        });
      }
    );
  } catch (error) {
    console.error('Error during user signup:', error);

    if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Invalid input data', error: error.message });
    } else if (error.code === 11000) { // Duplicate key error for MongoDB
      res.status(400).json({ message: 'User already exists' });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const payload = { user: { id: user.id } };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({
        message: 'Login successful',
        token,
        user: { firstName: user.firstName, id: user.id }
      });
    });
  } catch (err) {
    console.error('Error during user login:', err.message);
    res.status(500).send('Server error');
  }
});

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


module.exports = router;
