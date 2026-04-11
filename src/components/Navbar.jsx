import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ onNavigate, onSearchClick, logo }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCartCount, setIsCartOpen } = useCart();
  const { user, logoutUser } = useAuth();

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
      <nav className={`navbar ${isScrolled ? 'glass' : ''}`}>
        <div className="container nav-content">
          {/* Brand/Logo - Left */}
          <div className="nav-brand" onClick={() => handleNavClick('home')}>
            {logo && <img src={logo} alt="Roshni Creations Logo" className="nav-logo-image" />}
            <span className="product-name">Roshni Creations</span>
          </div>
          
          {/* Centered Links - Apple Style */}
          <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <li onClick={() => handleNavClick('home')}>Home</li>
            <li onClick={() => handleNavClick('shop')}>Collections</li>
            <li onClick={() => handleNavClick('digital-gold')}>Digital Gold</li>
            <li onClick={() => handleNavClick('quiz')}>Gift Guide</li>
          </ul>

          {/* Actions - Right */}
          <div className="nav-actions">
            <button className="icon-btn search-btn" onClick={onSearchClick} title="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="icon-btn cart-btn" onClick={() => setIsCartOpen(true)} title="Bag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
            </button>
            
            {user ? (
               <div className="user-actions hide-mobile">
                 <span className="user-greeting">Hi, {user.role === 'admin' ? 'Admin' : 'Customer'}</span>
                 <button className="btn btn-outline nav-logout-btn" onClick={logoutUser}>
                   Logout
                 </button>
               </div>
            ) : (
               <button className="btn btn-buy hide-mobile" onClick={() => handleNavClick('auth')}>
                 Login / Register
               </button>
            )}

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
