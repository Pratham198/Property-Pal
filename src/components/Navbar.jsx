import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Navbar.css';
import { FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
import logo from '../img/images/logo.png';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Side panel visibility
  const [showDropdown, setShowDropdown] = useState(false); // User dropdown visibility
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { isAuthenticated, userName, avatarColor, logout } = authContext;

  useEffect(() => {
    // Reset dropdown visibility when authentication status changes
    setShowDropdown(false);
  }, [isAuthenticated]);

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
    document.body.style.overflow = isOpen ? 'auto' : 'hidden'; // Prevent scrolling when side panel is open
  };

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out!');
    navigate('/'); // Redirect to home page after logout
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="brand-logo">
             <img  src={logo} alt='Property Pal' />
            {/* <Link to="/" >Property Pal</Link> */}
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/search">Search Properties</Link>
            <Link to="/list">List Property</Link>
            <Link to="/aboutus">About Us</Link>
          </div>
          <div className="auth-section">
            {isAuthenticated ? (
              <>
                <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
                  <span className="user-name">Welcome, {userName}</span>
                  <div className="user-avatar" style={{ backgroundColor: avatarColor }}>
                    {userName[0]?.toUpperCase()}
                  </div>
                  {showDropdown && (
                    <div className="user-dropdown" ref={dropdownRef}>
                      <Link to="/dashboard">Dashboard</Link>
                      <Link to="/my-properties">My Properties</Link>
                      <Link to="//messages">Messages</Link>
                      <Link to="/settings">Settings</Link>
                      <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-buttons-desktop">
                <Link to='/signup' className="nav-btn signup">Sign Up</Link>
                <Link to='/login' className="nav-btn login">Login</Link>
              </div>
            )}

          </div>
          <div className="menu-icon" onClick={toggleMenu}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </nav>
      <div className={`side-panel ${isOpen ? 'open' : ''}`}>
        <div className="side-panel-close" onClick={toggleMenu}>
          <FaTimes />
        </div>
        <div className="side-panel-content">
          <Link to="/">Home</Link>
          <Link to="/search">Search Properties</Link>
          <Link to="/list">List Property</Link>
          <Link to="/aboutus">About Us</Link>
        </div>
        {!isAuthenticated ? (
          <div className="auth-buttons">
            <Link to='/signup' className="nav-btn signup">Sign Up</Link>
            <Link to='/login' className="nav-btn login">Login</Link>
          </div>
        ) : (
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Navbar;
