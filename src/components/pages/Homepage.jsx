import React from 'react';
import Navbar from '../Navbar';
import HeroSection from '../HeroSection';
import PropertySection from '../PropertySection';
import FeaturesSection from '../FeaturesSection';
import TestimonialsSection from '../TestimonialsSection';
import Footer from '../Footer';

const Homepage = () => {
  // Sample property data to demonstrate multiple PropertyCard components

  return (
    <>
      {/* Navbar is usually at the top of the page */}
      <Navbar />

      {/* Hero section with the search bar */}
      <HeroSection />

      {/* Property Cards Section */}
      <PropertySection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Footer at the bottom of the page */}
      <Footer />
    </>
  );
};

export default Homepage;
