import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/Signup.css';
import openEyeIcon from '../../img/lgsp/openeye.svg';
import closeEyeIcon from '../../img/lgsp/closeeye.svg';
import googleLogo from '../../img/lgsp/googlelogo.png';
import { AuthContext } from '../../contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { login } = authContext;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formFields, setFormFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({ ...prevFields, [name]: value }));

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const handlePasswordFocus = () => setPasswordFocused(true);
  const handlePasswordBlur = () => setPasswordFocused(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const lengthValid = password.length >= 10;
    const upperCaseValid = /[A-Z]/.test(password);
    const lowerCaseValid = /[a-z]/.test(password);
    const numberValid = /\d/.test(password);
    const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setPasswordValid(lengthValid && upperCaseValid && lowerCaseValid && numberValid && specialCharValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formFields.email)) {
      toast.error('Invalid email format. Please enter a valid email address.');
      return;
    }

    if (formFields.password !== formFields.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (!passwordValid) {
      toast.error('Password does not meet the criteria for strength.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        firstName: formFields.firstName,
        lastName: formFields.lastName,
        email: formFields.email,
        password: formFields.password,
      });

      if (response.status === 201) {
        toast.success('Signup successful!');

        const { token, user } = response.data;
        
        if (token && user) {
          login(token, user);
          navigate('/');
        } else {
          console.error('Signup response does not contain token or user data:', response.data);
          toast.error('Signup failed. Invalid server response. Please try again.');
        }
      } else if (response.status === 400) {
        toast.error('Invalid input. Please check your details and try again.');
      } else if (response.status === 409) {
        toast.error('An account with this email already exists.');
      } else {
        toast.error('Signup failed. Please try again.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('API error response:', error.response);
          toast.error(error.response.data.message || 'An error occurred during signup. Please try again.');
        } else if (error.request) {
          console.error('No response received:', error.request);
          toast.error('No response from server. Please try again later.');
        } else {
          console.error('Error setting up request:', error.message);
          toast.error('An error occurred. Please try again.');
        }
      } else {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="signup-wrapper">
      <ToastContainer />
      <div className="signup-box">
        <h1 className="signup-header">Property Pal</h1>
        <h3 className="signup-header2">Create Account</h3>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="name-fields">
            <div className="input-container">
              <input
                type="text"
                name="firstName"
                value={formFields.firstName}
                onChange={handleInputChange}
                className="input"
                required
              />
              <label className={formFields.firstName ? 'floating-label-s filled' : 'floating-label-s'}>
                First Name
              </label>
            </div>
            <div className="input-container">
              <input
                type="text"
                name="lastName"
                value={formFields.lastName}
                onChange={handleInputChange}
                className="input"
                required
              />
              <label className={formFields.lastName ? 'floating-label-s filled' : 'floating-label-s'}>
                Last Name
              </label>
            </div>
          </div>
          <div className="input-container full-width">
            <input
              type="email"
              name="email"
              value={formFields.email}
              onChange={handleInputChange}
              className="input"
              required
            />
            <label className={formFields.email ? 'floating-label-s filled' : 'floating-label-s'}>
              Email Address
            </label>
          </div>
          <div className="password-container input-container">
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              value={formFields.password}
              onChange={handleInputChange}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              className={`input ${passwordFocused ? (passwordValid ? 'valid' : 'invalid') : ''}`}
              required
            />
            <label className={formFields.password ? 'floating-label-s filled' : 'floating-label-s'}>
              Password
            </label>
            <img
              src={passwordVisible ? closeEyeIcon : openEyeIcon}
              alt="Toggle Password Visibility"
              className="toggle-icon"
              onClick={togglePasswordVisibility}
            />
            {passwordFocused && !passwordValid && (
              <div className="password-hint">
                At least 10 characters with a mix of upper/lowercase, numbers, and symbols.
              </div>
            )}
          </div>
          <div className="password-container input-container">
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              name="confirmPassword"
              value={formFields.confirmPassword}
              onChange={handleInputChange}
              className="input"
              required
            />
            <label className={formFields.confirmPassword ? 'floating-label-s filled' : 'floating-label-s'}>
              Confirm Password
            </label>
            <img
              src={confirmPasswordVisible ? closeEyeIcon : openEyeIcon}
              alt="Toggle Confirm Password Visibility"
              className="toggle-icon"
              onClick={toggleConfirmPasswordVisibility}
            />
          </div>
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>

        <div className="login-text-container">
          <p className="login-text">
            Already have an account? <a href="/login" className="login-link">Login now</a>
          </p>
        </div>

        <div className="alternative-login">
          <div className="divider">
            <span className="divider-text">Or sign up with</span>
          </div>
          <button className="google-btn">
            <img src={googleLogo} alt="Google Logo" className="google-icon" />
            Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
