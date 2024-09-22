import React from 'react';
import '../styles/FeaturesSection.css';
import Filter from '../img/images/filter.png';
import Secure from '../img/images/secure.png';
import Verified from '../img/images/verified.png';
import Customer from '../img/images/customer-service.png';
import Chat from '../img/images/chat.png';

const FeaturesSection = () => {
  const features = [
    {
      image: 'https://cdn-icons-png.flaticon.com/512/833/833281.png', // Image for "Extensive Listings"
      title: 'Extensive Listings',
      description: 'Browse through thousands of properties across different cities with detailed descriptions and high-quality photos.',
    },
    {
      image: Filter, // Image for "Advanced Search Filters"
      title: 'Advanced Search Filters',
      description: 'Utilize our powerful search filters to find properties that match your precise needs and preferences.',
    },
    {
      image: Secure, // Image for "Secure Transactions"
      title: 'Secure Transactions',
      description: 'Our platform ensures secure and reliable transactions for all your property buying, selling, and renting needs.',
    },
    {
      image: Customer, // Image for "24/7 Customer Support"
      title: '24/7 Customer Support',
      description: 'Get round-the-clock support from our dedicated customer service team to help you with any issues or queries.',
    },
    {
      image: Verified, // Image for "Verified Listings"
      title: 'Verified Listings',
      description: 'All property listings are thoroughly verified to ensure authenticity and prevent fraudulent activities.',
    },
    {
      image: Chat, // Image for "Legal Assistance"
      title: 'Real Time Chat',
      description: 'Chat directly through this application with the buyer or seller using our premium feature.',
    },
  ];

  return (
    <section className="features-section">
      <h2 className="features-title">Why Choose Property Pal?</h2>
      <p className="features-description">
        Discover the unique features that make Property Pal the best platform for property buying, selling, and renting.
      </p>
      <div className="features-container">
        {features.map((feature, index) => (
          <div key={index} className="feature-item">
            <img src={feature.image} alt={feature.title} className="feature-image" />
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
