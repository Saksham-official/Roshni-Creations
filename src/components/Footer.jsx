import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid rgba(0,0,0,0.05)',
      padding: '5rem 0 2rem',
      marginTop: 'auto',
      backgroundColor: 'var(--bg-light)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          <div>
            <h3 style={{fontFamily: 'var(--font-serif)', color: 'var(--brand-maroon)', marginBottom: '1.25rem', fontSize: '1.8rem'}}>Roshni Creations</h3>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.8'}}>
              Crafting timeless elegance for the modern soul. Heritage quality, contemporary design.
            </p>
          </div>
          <div>
            <h4 style={{color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 500}}>Quick Links</h4>
            <ul style={{listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Shop</a></li>
              <li><a href="#">Digital Gold</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 500}}>Support</h4>
            <ul style={{listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Track Order</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 500}}>Stay Connected</h4>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem'}}>Subscribe to our newsletter for exclusive updates.</p>
            <div style={{display: 'flex'}}>
              <input type="email" placeholder="Email Address" style={{
                padding: '0.75rem 1.25rem', 
                background: 'var(--bg-white)', 
                border: '1px solid rgba(0,0,0,0.1)', 
                color: 'var(--text-primary)',
                borderRadius: '8px 0 0 8px',
                width: '100%',
                outline: 'none'
              }} />
              <button className="btn-primary" style={{padding: '0.75rem 1.5rem', borderRadius: '0 8px 8px 0', border: 'none'}}>Join</button>
            </div>
          </div>
        </div>
        <div style={{textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(0,0,0,0.05)'}}>
          &copy; {new Date().getFullYear()} Roshni Creations. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
