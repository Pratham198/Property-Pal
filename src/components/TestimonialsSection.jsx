import React, { useEffect, useRef } from 'react';
import '../styles/TestimonialsSection.css';

const TestimonialsSection = () => {
  const scrollContainerRef = useRef(null);

  const testimonials = [
    {
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
      name: 'John Doe',
      review: 'Estate Heaven helped me find my dream home effortlessly. Their platform is intuitive and easy to use!',
      rating: 3,
    },
    {
      image: 'https://randomuser.me/api/portraits/women/65.jpg',
      name: 'Jane Smith',
      review: "I sold my property within a week, thanks to Estate Heaven's premium listing feature!",
      rating: 4,
    },
    {
      image: 'https://randomuser.me/api/portraits/men/85.jpg',
      name: 'Michael Johnson',
      review: 'The customer support was outstanding, and the property options were plentiful and varied.',
      rating: 5,
    },
    {
      image: 'https://randomuser.me/api/portraits/women/45.jpg',
      name: 'Emily Davis',
      review: 'Highly recommend Estate Heaven for their verified listings and smooth transaction process.',
      rating: 4,
    },
    {
      image: 'https://randomuser.me/api/portraits/men/55.jpg',
      name: 'Chris Wilson',
      review: 'The search filters were incredibly helpful in finding exactly what I was looking for.',
      rating: 5,
    },
  ];

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) return;

    let scrollSpeed = 1; // Adjust this value to change scroll speed

    const cloneContent = () => {
      // Clone all testimonial cards to create a seamless effect
      const cards = Array.from(scrollContainer.children);
      cards.forEach((card) => {
        const clone = card.cloneNode(true);
        scrollContainer.appendChild(clone);
      });
    };

    cloneContent();

    let animationFrameId;

    const scrollContent = () => {
      if (scrollContainer) {
        // Scroll left by scrollSpeed pixels
        scrollContainer.scrollLeft += scrollSpeed;
        // If the first set of cards is fully out of view, reset scrollLeft
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scrollContent);
    };

    animationFrameId = requestAnimationFrame(scrollContent);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section className="testimonials-section">
      <h2 className="testimonials-title">What Our Clients Say</h2>
      <div className="testimonials-container" ref={scrollContainerRef}>
        {testimonials.map((testimonial, index) => (
          <div className="testimonial-card" key={index}>
            <img src={testimonial.image} alt={testimonial.name} className="testimonial-avatar" />
            <h4 className="testimonial-name">{testimonial.name}</h4>
            <p className="testimonial-review">{testimonial.review}</p>
            <div className="testimonial-rating">
              {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
