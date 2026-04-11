import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './DigitalGold.css';

const DigitalGold = () => {
  const contentRef = useScrollReveal({ threshold: 0.2 });

  return (
    <div className="section digital-gold-page">
      <div className="container">
        <div ref={contentRef} className="dg-content glass reveal">
          <div className="dg-text">
            <h2 className="section-title" style={{textAlign: 'left', marginBottom: '1rem'}}>24K Pure Digital Gold</h2>
            <p className="dg-price-badge">Live Rate: ₹6,854.20 /gm</p>
            <p className="dg-desc">
              Start your glowing journey with as little as ₹10. Authentic 24K purity, safely vaulted, and easily redeemable for our hallmark jewelry anytime.
            </p>
            
            <div className="dg-calculator outline-glass">
              <h3>Start Investing</h3>
              <div className="input-group">
                <label>Amount (₹)</label>
                <input type="number" placeholder="Enter Amount" defaultValue="1000" />
              </div>
              <div className="input-group">
                <label>Weight (gm)</label>
                <input type="number" placeholder="Weight" disabled defaultValue="0.145" />
              </div>
              <button className="btn btn-primary dg-btn">Buy Now</button>
            </div>
            
            <div className="dg-features">
              <div className="dg-feature">
                <span className="text-gold" style={{marginRight: '8px'}}>✓</span> 100% Secure
              </div>
              <div className="dg-feature">
                <span className="text-gold" style={{marginRight: '8px'}}>✓</span> 24K Purity
              </div>
              <div className="dg-feature">
                <span className="text-gold" style={{marginRight: '8px'}}>✓</span> Zero Vault Fees
              </div>
            </div>
          </div>
          
          <div className="dg-visual">
            <div className="gold-coin-wrapper">
              <div className="gold-coin">
                <span className="coin-text">24K</span>
                <span className="coin-brand">Roshni</span>
              </div>
              {/* Apple-like soft glow behind coin */}
              <div className="coin-glow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalGold;
