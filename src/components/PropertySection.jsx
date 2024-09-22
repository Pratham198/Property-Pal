import React, { useState } from 'react';
import '../styles/PropertySection.css'; // Import the CSS styles
import { FaBed, FaBath, FaHome, FaRulerCombined, FaCouch, FaHeart, FaMapMarkerAlt } from 'react-icons/fa'; // Importing icons

const PropertySection = () => {
  // State to manage favorite status for each property
  const [favorites, setFavorites] = useState([]);

  // Toggle favorite status for a property
  const toggleFavorite = (index) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(index)
        ? prevFavorites.filter((i) => i !== index) // Remove from favorites
        : [...prevFavorites, index] // Add to favorites
    );
  };

  // Sample data for properties
  const properties = [
    {
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjU5ODk5Nzcy&ixlib=rb-1.2.1&q=80&w=1080',
      title: 'Modern Family Home',
      price: '₹45,00,000',
      type: 'For Sale',
      location: 'Mumbai, India',
      owner: 'John Doe',
      bhkbs: {
        bedrooms: 4,
        hall: 1,
        kitchen: 1,
        bathrooms: 2,
        area: 2500, // in sq. ft.
      },
    },
    {
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjU5ODk5Nzcy&ixlib=rb-1.2.1&q=80&w=1080',
      title: 'Cozy Apartment',
      price: '₹90,000/month',
      type: 'For Rent',
      location: 'New Delhi, India',
      owner: 'Jane Smith',
      bhkbs: {
        bedrooms: 2,
        hall: 1,
        kitchen: 1,
        bathrooms: 1,
        area: 1200, // in sq. ft.
      },
    },
    {
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjU5ODk5Nzcy&ixlib=rb-1.2.1&q=80&w=1080',
      title: 'Luxury Villa',
      price: '₹1,20,00,000',
      type: 'For Sale',
      location: 'Bangalore, India',
      owner: 'Michael Johnson',
      bhkbs: {
        bedrooms: 5,
        hall: 2,
        kitchen: 2,
        bathrooms: 4,
        area: 5000, // in sq. ft.
      },
    },
  ];

  return (
    <section className="property-section">
      <h2 className="property-section-title">Explore Our Featured Properties</h2>
      <p className="property-section-description">
        Discover a variety of properties that match your lifestyle. Whether you are looking for a family home, a cozy apartment, or a luxurious villa, we have it all.
      </p>
      <div className="property-grid">
        {properties.map((property, index) => (
          <div key={index} className="property-card">
            <div className="property-type-badge">{property.type}</div>
            <FaHeart
              className={`heart-icon ${favorites.includes(index) ? 'favorite' : ''}`}
              onClick={() => toggleFavorite(index)}
            />
            <img src={property.image} alt={property.title} className="property-image" />
            <div className="property-info">
              <h3 className="property-title">{property.title}</h3>
              <hr />
              <div className="property-location-owner">
                <span className="property-location"><FaMapMarkerAlt /> {property.location}</span>
                <span className="property-owner">{property.owner}</span>
              </div>
              <div className="property-bhkbs">
                <span><FaBed /> {property.bhkbs.bedrooms} BHK</span>
                <span><FaCouch /> {property.bhkbs.hall} Hall</span>
                <span><FaHome /> {property.bhkbs.kitchen} Kitchen</span>
                <span><FaBath /> {property.bhkbs.bathrooms} Bathrooms</span>
                <span><FaRulerCombined /> {property.bhkbs.area} sq. ft.</span>
              </div>
              <div className="property-footer">
                <span className="property-price">{property.price}</span>
                <button className="property-btn">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertySection;
