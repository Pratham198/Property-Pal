const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Email configuration using nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com', // Use your email host, e.g., smtp.gmail.com
  port: process.env.EMAIL_PORT || 587, // Use 587 for secure communication with TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: false, // Set true for port 465 (SSL), false for 587 (TLS)
  tls: {
    rejectUnauthorized: false,
  },
});


// Request OTP and send it to user's email
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User with this email does not exist' });
    }

    // Generate a random reset token
    // Generate a 6-digit OTP
const resetToken = Math.floor(100000 + Math.random() * 900000).toString();


    // Set token and expiration time (1 hour)
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // Expires in 1 hour
    await user.save();

    // Send the reset token via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <p>You have requested a password reset for your "Property Pal" account.</p>
        <p>Please use the following OTP to reset your password:</p>
        <h2>${resetToken}</h2>
        <p>This OTP will expire in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Error sending OTP: ', error); // Log error for debugging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify OTP and reset the password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    console.log(user);
    
    
    
    // Log if user is not found
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid email address' });
    }

      // Debugging logs
      // console.log('Received OTP:', otp);
      // console.log('Stored OTP:', user.resetToken);
      // console.log('OTP Expiry:', user.resetTokenExpiry);
      

    // Check if the OTP matches and is still valid
    if (user.resetToken !== otp || user.resetTokenExpiry < Date.now()) {
      console.log('Invalid OTP or OTP has expired');
      return res.status(400).json({ message: 'Invalid OTP or OTP has expired' });
    }

    // Log the process of hashing password
    console.log('User found, hashing new password');
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear the reset token and expiry fields as they're no longer needed
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    // Save the updated user record with the new password
    await user.save();
    // console.log('Updated User:', user);


    // Log success
    console.log('Password reset successful');
    
    // Respond with a success message
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    // Log the error for debugging
    console.error('Error resetting password: ', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
