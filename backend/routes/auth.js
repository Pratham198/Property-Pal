const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { forgotPassword, resetPassword } = require('../controllers/authController');
const User = require('../models/User');
const passport = require('passport');
const { Navigate } = require('react-router-dom');
const router = express.Router();

// Use a secret key for JWT (recommended to be stored securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// // Google auth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login', // Redirect to login on failure
}), async (req, res) => {
  // Successful authentication
  const user = req.user; // Get user information from req.user
  const payload = {
    user: {
      id: user.id,
    },
  };

  // Generate JWT Token
  jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
    if (err) {
      console.error('Error signing token:', err);
      return res.status(500).json({ message: 'Error generating token' });
    }

    // Redirect to frontend with token and user data as query parameters
    res.redirect(`http://localhost:3000?token=${token}&user=${JSON.stringify({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture,
    })}`);
  });
});


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
      if (!user) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Create and sign JWT
      const payload = { user: { id: user.id } };
      jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
          if (err) {
              console.error('Error signing token:', err);
              return res.status(500).json({ message: 'Error generating token' });
          }
          res.json({
              message: 'Login successful',
              token,
              user: {
                  id: user.id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email, // Include email if needed
              },
          });
      });
  } catch (err) {
      console.error('Error during user login:', err.message);
      res.status(500).json({ message: 'Server error' });
  }
});

// Signup Logic for Google Login
router.post('/signup/google', async (req, res) => {
  const { firstName, lastName, email, googleId, profilePicture } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ googleId });
    if (!user) {
      // Create a new user with the Google ID and null password
      user = new User({
        firstName,
        lastName,
        email,
        googleId,
        profilePicture, // Store the profile picture URL
        password: null, // No password for Google users
      });
      await user.save();
    } else {
      // Optionally update existing user information if needed
      user.firstName = firstName;
      user.lastName = lastName;
      user.profilePicture = profilePicture; // Update profile picture if provided
      await user.save();
    }

     // Generate JWT Token
     const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('Error signing token:', err);
          return res.status(500).json({ message: 'Error generating token' });
        }

    // Successful login or signup response
    res.status(200).json({
      message: 'Google signup successful',
      token,
      user,
    });
  });
  } catch (error) {
    console.error('Error during Google signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Logic for Google Users
router.post('/login/google', async (req, res) => {
  const { googleId } = req.body;

  try {
    // Find user by Google ID
    const user = await User.findOne({ googleId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

     // Generate JWT Token
     const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('Error signing token:', err);
          return res.status(500).json({ message: 'Error generating token' });
        }

    // Successful login response
    res.status(200).json({
      message: 'Google login successful',
      token,
      user,
    });
  });
  } catch (error) {
    console.error('Error during Google login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


module.exports = router;
