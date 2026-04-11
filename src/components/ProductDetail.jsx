import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useCart } from '../context/CartContext';
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

const ProductDetail = ({ product, onNavigate, logo }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
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
      handler: async function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        
        // Send Email Confirmation via Resend API (through our backend)
        try {
          await fetch('http://localhost:5000/api/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'judge@hackathon.com', // Pre-filled for demo
              paymentId: response.razorpay_payment_id,
              orderDetails: {
                name: product.name,
                price: product.price
              }
            })
          });
        } catch (err) {
          console.error('Failed to send auto-confirmation email:', err);
        }
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

          <div className="product-quantity-selector info-animate" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: 500, fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)' }}>Quantity:</span>
            <div className="quantity-controls" style={{ border: '1px solid var(--primary-gold)', borderRadius: '50px', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', color: 'var(--text-primary)' }}>-</button>
              <span style={{ fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', color: 'var(--text-primary)' }}>+</button>
            </div>
          </div>
          
          <p className="product-description info-animate">
            A brilliant masterpiece from our elite signature collection. This bespoke piece embodies the fusion of classic heritage and contemporary minimalism. Handcrafted by master artisans to celebrate your precious moments.
          </p>

          <div className="action-buttons info-animate" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <button className="btn btn-primary btn-large" style={{flex: 1}} onClick={() => addToCart(product, quantity)}>Add to Cart</button>
              <button className="btn btn-outline btn-large" style={{flex: 1}} onClick={handlePayment}>Buy Now</button>
            </div>
            <button className="btn btn-text btn-large" style={{ width: '100%', border: '1px dashed var(--primary-gold)', background: 'transparent' }}>✦ Try at Home Free</button>
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
