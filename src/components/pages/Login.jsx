import React, { useState, useContext } from 'react';
import "../../styles/Login.css";
import axios from 'axios';
import openEyeIcon from '../../img/lgsp/openeye.svg';
import closeEyeIcon from '../../img/lgsp/closeeye.svg';
import googleLogo from '../../img/lgsp/googlelogo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import logo from '../../img/images/logo.png';


const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { login } = authContext;

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email format
    if (!isValidEmail(formData.email)) {
      toast.error("Invalid email format. Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);

      // Handle success
      if (response.status === 200) {
        // Store token and user info in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        const token = localStorage.getItem("token") || "";
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        login(token, user);
        // toast.success("Login successful!");
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data.message;

        if (status === 400 && message === "Invalid email") {
          toast.error("User not found. Please check your email.");
        } else if (status === 400 && message === "Invalid password") {
          toast.error("Invalid password. Please try again.");
        } else {
          toast.error("An unexpected error occurred. Please try again later.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

// Google Login
const handleGoogleLogin = () => {
  window.open("http://localhost:5000/api/auth/google", "_self");
};


  return (
    <div className="login-wrapper">
      <ToastContainer />
      <div className="login-box">
          <div>
             <img className="brand-logo" src={logo} alt='Property Pal' />
            {/* <Link to="/" >Property Pal</Link> */}
          </div>
        <h3 className="login-header2">Welcome Back</h3>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-container full-width">
            <input
              type="email"
              name="email"
              onChange={handleInputChange}
              className="input"
              required
              value={formData.email}
            />
            <label className={`floating-label-l ${formData.email ? 'filled' : ''}`}>
              Email Address
            </label>
          </div>
          <div className="password-container input-container">
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              onChange={handleInputChange}
              className="input"
              required
              value={formData.password}
            />
            <label className={`floating-label-l ${formData.password ? 'filled' : ''}`}>
              Password
            </label>
            <img
              src={passwordVisible ? closeEyeIcon : openEyeIcon}
              alt="Toggle Password Visibility"
              className="toggle-icon"
              onClick={togglePasswordVisibility}
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="signup-text-container">
          <p className="signup-text">
            Don't have an account? <a href="/signup" className="signup-link">Sign up now</a>
          </p>
          <p className="forgot-password-text">
            <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
          </p>
        </div>

        <div className="alternative-login">
          <div className="divider">
            <span className="divider-text">Or login with</span>
          </div>
          <button className="google-btn" onClick={handleGoogleLogin}>
            <img src={googleLogo} alt="Google Logo" className="google-icon" />
            Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
