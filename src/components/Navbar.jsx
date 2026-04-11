import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ onNavigate, onSearchClick, logo, cartCount = 0 }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page) => {
    setIsMobileMenuOpen(false);
    onNavigate(page);
  };

  return (
    <div className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      {/* Utility Banner */}
      <div className="utility-bar">
        <div className="container utility-content">
          <span>🏠 Free Try at Home</span>
          <span className="hide-mobile">⚡ Fast Delivery</span>
          <span>🗺️ Store Locator</span>
        </div>
      </div>
      
      <nav className={`navbar ${isScrolled ? 'glass' : ''}`}>
        <div className="container nav-content">
          <div className="nav-brand" onClick={() => handleNavClick('home')}>
            {logo && <img src={logo} alt="Roshni Creations Logo" className="nav-logo-image" />}
            <h1 className="logo-text"><span>R</span>oshni <span>C</span>reations</h1>
          </div>
          
          <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <li onClick={() => handleNavClick('home')}>Home</li>
            <li onClick={() => handleNavClick('shop')}>Jewellery</li>
            <li onClick={() => handleNavClick('digital-gold')}>Digital Gold</li>
            <li onClick={() => handleNavClick('quiz')}>Gifts</li>
          </ul>

          <div className="nav-actions">
            <button className="icon-btn search-btn" onClick={onSearchClick} title="Search Products">
              <span className="search-text hide-mobile">Search...</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="icon-btn cart-btn" title="Cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            
            <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <div className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></div>
              <div className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></div>
            </button>
          </div>
        </div>
      </nav>
      {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}
    </div>
  );
};

export default Navbar;
