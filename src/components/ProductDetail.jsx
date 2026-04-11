import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import './ProductDetail.css';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const ProductDetail = ({ product, onNavigate, logo, onAddToCart }) => {
  const [activeImage, setActiveImage] = useState(0);
  const containerRef = useRef(null);

  useGSAP(() => {
    // Elegant entrance animation
    gsap.fromTo(".gallery-animate", 
      { opacity: 0, x: -30 }, 
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
    );
    gsap.fromTo(".info-animate", 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 }
    );
  }, [product]);

  const handlePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: "rzp_test_Sc7NXcTnAZCMkn", // Test Key ID provided
      amount: product.price * 100, // Amount is in currency subunits (paise)
      currency: "INR",
      name: "Roshni Creations",
      description: `Purchase ${product.name}`,
      image: logo || "https://i.imgur.com/3g7nmJC.png", // Use actual logo
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "Hackathon Judge",
        email: "judge@hackathon.com",
        contact: "9999999999",
      },
      theme: {
        color: "#D1B88A", // Match the elegant gold theme
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  if (!product) return null;

  return (
    <div className="product-detail-page" ref={containerRef}>
      <div className="container product-detail-container">
        
        {/* Gallery */}
        <div className="product-gallery gallery-animate">
          <button className="back-btn" onClick={() => onNavigate('shop')}>
             ← Back to Collections
          </button>
          <div className="main-image-container">
            <img src={product.images[activeImage] || product.images[0]} alt={product.name} className="main-image" />
          </div>
          {product.images.length > 1 && (
            <div className="thumbnail-list">
              {product.images.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt={`${product.name} view ${idx + 1}`} 
                  className={`thumbnail ${activeImage === idx ? 'active' : ''}`}
                  onClick={() => setActiveImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-info-section">
          <span className="product-detail-category info-animate">{product.category}</span>
          <h1 className="product-detail-title info-animate">{product.name}</h1>
          <div className="product-detail-price info-animate">
            ₹{product.price.toLocaleString('en-IN')}
            <span className="product-detail-original-price">₹{(product.price * 1.25).toLocaleString('en-IN')}</span>
          </div>
          
          <p className="product-description info-animate">
            A brilliant masterpiece from our elite signature collection. This bespoke piece embodies the fusion of classic heritage and contemporary minimalism. Handcrafted by master artisans to celebrate your precious moments.
          </p>

          <div className="action-buttons info-animate">
            <button className="btn btn-outline btn-large" onClick={() => onAddToCart && onAddToCart(product)}>Add to Cart</button>
            <button className="btn btn-primary btn-large" onClick={handlePayment}>Buy Now</button>
          </div>

          <div className="trust-badges info-animate">
            <div className="trust-badge-item">
              <div className="trust-badge-icon">💎</div>
              <span className="trust-badge-text">Certified Jewellery</span>
            </div>
            <div className="trust-badge-item">
              <div className="trust-badge-icon">🚚</div>
              <span className="trust-badge-text">Free Insured Shipping</span>
            </div>
            <div className="trust-badge-item">
              <div className="trust-badge-icon">↩️</div>
              <span className="trust-badge-text">15-Day Returns</span>
            </div>
            <div className="trust-badge-item">
              <div className="trust-badge-icon">✨</div>
              <span className="trust-badge-text">Lifetime Exchange</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
