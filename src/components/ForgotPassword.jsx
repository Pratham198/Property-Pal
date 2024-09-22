import React, { useState } from 'react';
import "../styles/ForgotPassword.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Loader from '../img/lgsp/Loader.gif'; // You can use a modern loader image
import openEyeIcon from '../img/lgsp/openeye.svg'; // Import open eye icon
import closeEyeIcon from '../img/lgsp/closeeye.svg'; // Import close eye icon

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState(''); // Added confirm password field
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State for confirm password visibility
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email.');
      return;
    }
    if (!isValidEmail(email)) {
      toast.error('Invalid email format.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      if (response.status === 200) {
        toast.success('OTP sent! Check your email.');
        setIsOtpSent(true);
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmNewPassword) {
      toast.error('Please enter OTP and new passwords.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (!isValidPassword(newPassword)) {
      toast.error('Password does not meet the criteria for strength.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      if (response.status === 200) {
        toast.success('Password reset successfully. Redirecting to login...');
       navigate('/login'); // Delay navigation to allow toast message to be visible
      }
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible); // Toggle password visibility
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible); // Toggle confirm password visibility

  // Function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Function to validate password strength
  const isValidPassword = (password) => {
    const lengthValid = password.length >= 10;
    const upperCaseValid = /[A-Z]/.test(password);
    const lowerCaseValid = /[a-z]/.test(password);
    const numberValid = /\d/.test(password);
    const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return lengthValid && upperCaseValid && lowerCaseValid && numberValid && specialCharValid;
  };

  return (
    <div className="forgot-password-container">
      <ToastContainer />
      <div className="forgot-password-box">
        <h1 className="forgot-password-title">Forgot Password</h1>

        {!isOtpSent ? (
          <form onSubmit={handleSendOtp}>
            <div className="input-container">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="forgot-input"
                required
              />
              <label className={`forgot-floating-label ${email ? 'filled' : ''}`}>
                Enter Your Email
              </label>
            </div>
            <button type="submit" className="forgot-btn" disabled={isLoading}>
              {isLoading ? <img src={Loader} alt="Loading..." className="loader-icon" /> : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="input-container">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="forgot-input"
                required
              />
              <label className={`forgot-floating-label ${otp ? 'filled' : ''}`}>Enter OTP</label>
            </div>
            <div className="input-container">
              <input
                type={passwordVisible ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="forgot-input"
                required
              />
              <label className={`forgot-floating-label ${newPassword ? 'filled' : ''}`}>New Password</label>
              <img
                src={passwordVisible ? closeEyeIcon : openEyeIcon}
                alt="Toggle Password Visibility"
                className="toggle-icon"
                onClick={togglePasswordVisibility}
              />
            </div>
            <div className="input-container">
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="forgot-input"
                required
              />
              <label className={`forgot-floating-label ${confirmNewPassword ? 'filled' : ''}`}>Confirm New Password</label>
              <img
                src={confirmPasswordVisible ? closeEyeIcon : openEyeIcon}
                alt="Toggle Confirm Password Visibility"
                className="toggle-icon"
                onClick={toggleConfirmPasswordVisibility}
              />
            </div>
            <button type="submit" className="forgot-btn" disabled={isLoading}>
              {isLoading ? <img src={Loader} alt="Loading..." className="loader-icon" /> : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
