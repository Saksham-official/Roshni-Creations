import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import './SearchModal.css';

const SearchModal = ({ isOpen, onClose, products, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const resultsRef = useRef(null);

  useGSAP(() => {
    if (isOpen) {
      // Elegant entrance animations with GSAP
      gsap.fromTo(overlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.6, ease: "power2.out" }
      );
      
      gsap.fromTo(modalRef.current, 
        { y: 30, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out", delay: 0.1 }
      );
      
      gsap.fromTo(".search-header > *", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.2 }
      );
    }
  }, [isOpen]);

  // Animate results appearing
  useGSAP(() => {
    if (isOpen) {
      gsap.fromTo(".search-item, .popular-tags span", 
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [searchTerm, isOpen]);

  if (!isOpen) return null;

  const results = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose} ref={overlayRef}>
      <div className="search-modal" onClick={e => e.stopPropagation()} ref={modalRef}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="search-header">
          <h2 className="elegant-title">Discover</h2>
          <p className="elegant-subtitle">Search across our premium collection</p>
          <div className="search-input-wrapper">
            <input 
              type="text" 
              placeholder="Search for Chokers, Mangalsutras, Watches..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="search-results" ref={resultsRef}>
          {searchTerm && results.length > 0 ? (
            <div className="results-grid">
              {results.slice(0, 4).map(product => (
                <div key={product.id} className="search-item" onClick={() => { onClose(); onNavigate('shop'); }}>
                  <img src={product.images[0]} alt={product.name} />
                  <div>
                    <h4>{product.name}</h4>
                    <p className="text-gold-light">₹{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm && results.length === 0 ? (
            <p className="no-results">No products found for "{searchTerm}"</p>
          ) : (
            <div className="popular-searches">
              <p>Popular Searches:</p>
              <div className="popular-tags">
                <span onClick={() => setSearchTerm('Choker')}>Choker</span>
                <span onClick={() => setSearchTerm('Mangalsutra')}>Mangalsutra</span>
                <span onClick={() => setSearchTerm('Bridal')}>Bridal</span>
                <span onClick={() => setSearchTerm('Watch')}>Premium Watch</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
