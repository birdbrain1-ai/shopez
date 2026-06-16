import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-column">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px rgba(6,182,212,0.4))' }}>
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>SHOPEZ</span>
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
            Experience the future of online shopping. Hand-curated premium hardware, accessories, and wear. Crafted for speed, style, and visuals.
          </p>
        </div>

        <div className="footer-column">
          <h4>Explore</h4>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); }}>Trending Items</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); }}>Hot Releases</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); }}>Top Brands</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); }}>Gift Cards</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Customer Care</h4>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); }}>Help Center</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); }}>Track Orders</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); }}>Returns & Refunds</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); }}>Terms of Service</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Let's Connect</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Sign up to our newsletter for exclusive offers and secret drops.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="email" placeholder="Your email..." className="form-control" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} />
            <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Join</button>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SHOPEZ E-Commerce Inc. Designed with glassmorphic style. All rights reserved.</p>
      </div>
    </footer>
  );
}
