import React from 'react';
import '../styles/Footer.css';
import { useNavigate, Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>Property Pal</h3>
          <p>Your dream home is just a click away.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/search">Search Properties</Link>
          <Link to="/list">List Property</Link>
          <Link to="/aboutus">About Us</Link>
        </div>
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>Email: info@propertypal.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Property Pal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
