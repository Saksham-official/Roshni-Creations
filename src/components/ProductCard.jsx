import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCart } from '../context/CartContext';
import { initiatePayment } from '../utils/payment';
import './ProductCard.css';

const ProductCard = ({ product, index = 0, onClick }) => {
  const cardRef = useScrollReveal({ threshold: 0.1, persist: true });
  const { addToCart } = useCart();

  const handleBuyNow = (e) => {
    e.stopPropagation();
    initiatePayment({
      amount: product.price,
      description: `Purchase ${product.name}`,
      items: [product.name],
      onSuccess: () => alert("Thank you for your instant purchase!")
    });
  };

  const originalPrice = product.price * 1.25; 
  const discount = "20% OFF";

  return (
    <div 
      ref={cardRef} 
      className="product-card reveal" 
      style={{ transitionDelay: `${Math.min(index * 100, 500)}ms`, cursor: 'pointer' }}
      onClick={onClick}
    >
      <div className="product-image-container">
        <img src={product.images[0]} alt={product.name} className="product-image" loading="lazy" />
        <div className="badges-container">
          {product.isFeatured && <span className="badge">Best Seller</span>}
          <span className="badge badge-discount">{discount}</span>
        </div>
        
        <button className="virtual-try-btn" title="Virtual Try On" onClick={(e) => { e.stopPropagation(); alert("Opening AR Try On...") }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>

        <div className="product-overlay">
          <button className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}>Add to Cart</button>
          <button className="btn btn-primary btn-sm" onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
      <div className="product-info">
        <div className="product-category-row">
          <span className="product-category">{product.category}</span>
          <span className="delivery-badge">⚡ Fast Delivery</span>
        </div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price-row">
          <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
          <p className="product-original-price">₹{originalPrice.toLocaleString('en-IN')}</p>
        </div>
        
        <div className="product-card-actions">
           <button className="quick-add-btn" onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}>+ Add</button>
           <button className="quick-pay-btn" onClick={handleBuyNow}>Instant Buy</button>
        </div>

        <div className="product-footer">
          <div className="product-rating">
            <span className="star">★</span> {product.rating || '4.9'}
          </div>
          <span className="try-home-text">🏡 Try at Home</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
