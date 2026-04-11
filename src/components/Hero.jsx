import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Hero.css';

const Hero = ({ onNavigate }) => {
  const titleRef = useScrollReveal();
  const descRef = useScrollReveal({ delay: 100 });
  const ctaRef = useScrollReveal({ delay: 200 });
  const imageRef = useScrollReveal({ threshold: 0.2 });

  return (
    <div className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <div ref={titleRef} className="reveal">
            <span className="hero-badge">NEW COLLECTION</span>
            <h1 className="hero-title">Everyday <span className="text-maroon">Fine</span> Jewellery</h1>
          </div>
          <p ref={descRef} className="hero-description reveal reveal-delay-1">
            Beautifully crafted, lightweight designs for modern women. Experience it first with our <strong>Free Try at Home</strong> service.
          </p>
          <div ref={ctaRef} className="hero-cta reveal reveal-delay-2">
            <button className="btn btn-primary" onClick={() => onNavigate('shop')}>Shop Now</button>
            <button className="btn btn-outline" onClick={() => onNavigate('shop')}>Book Try at Home</button>
          </div>
        </div>
        
        <div ref={imageRef} className="hero-image-wrapper reveal reveal-delay-3">
          <div className="hero-presentation">
            <img src="https://raw.githubusercontent.com/SatyawanPanchal/roshni_creations_assets_ssh01/main/assets/01/product-001-1.webp" alt="Premium Kundan Choker" className="hero-image" />
            <div className="hero-card-info glass">
              <h4>Premium Kundan Choker</h4>
              <p className="text-gold">₹1800</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
