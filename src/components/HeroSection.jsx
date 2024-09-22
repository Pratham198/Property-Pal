import React, { useState } from 'react';
import '../styles/HeroSection.css'; // Importing the CSS file for styling

const HeroSection = () => {
  const [selectedOption, setSelectedOption] = useState('buy'); // State to track buy/rent option

  return (
    <section className="hero-section">
      <div className="image-overlay"></div> {/* Overlay to dull the image */}
      <div className="hero-content">
        <h1>Welcome to Property Pal</h1>
        <p>Your journey to finding the perfect home starts here. Discover, Explore, and Fall in Love with your next home.</p>
        <div className="search-bar">
          {/* Toggle for Buy/Rent */}
          <div className="search-toggle">
            <button 
              className={`toggle-btn ${selectedOption === 'buy' ? 'active' : ''}`} 
              onClick={() => setSelectedOption('buy')}>
              Buy
            </button>
            <button 
              className={`toggle-btn ${selectedOption === 'rent' ? 'active' : ''}`} 
              onClick={() => setSelectedOption('rent')}>
              Rent
            </button>
          </div>
          <input type="text" placeholder="Enter city" />
          <button className="search-btn">
            <i className="fas fa-search"></i> Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
