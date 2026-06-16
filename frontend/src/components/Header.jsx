import React, { useContext } from 'react';
import { AppContext } from '../App';

export default function Header() {
  const { 
    currentPage, 
    setCurrentPage, 
    user, 
    logout, 
    cart, 
    searchQuery, 
    setSearchQuery 
  } = useContext(AppContext);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage('shop');
  };

  return (
    <header className="header">
      <div className="header-brand" onClick={() => setCurrentPage('home')}>
        {/* Glowing Shop Bag SVG Logo */}
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <span>SHOPEZ</span>
      </div>

      <form className="header-search" onSubmit={handleSearchSubmit}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          placeholder="Search products..." 
          className="form-control"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <nav className="header-actions">
        <span 
          className={`header-link ${currentPage === 'shop' ? 'text-gradient' : ''}`} 
          onClick={() => { setSearchQuery(''); setCurrentPage('shop'); }}
        >
          Shop
        </span>

        {/* Cart Link with Glowing Badge */}
        <div className="badge-container">
          <span 
            className={`header-link ${currentPage === 'cart' ? 'text-gradient' : ''}`}
            onClick={() => setCurrentPage('cart')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Cart
          </span>
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </div>

        {/* Dynamic User Profile or Authentication Links */}
        {user ? (
          <>
            <span 
              className={`header-link ${currentPage === 'dashboard' ? 'text-gradient' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {user.name.split(' ')[0]}
              {user.isAdmin && <span style={{ fontSize: '0.65rem', padding: '1px 4px', background: 'rgba(6,182,212,0.2)', border: '1px solid var(--accent-cyan)', borderRadius: '4px', marginLeft: '2px', color: 'var(--accent-cyan)' }}>Admin</span>}
            </span>
            <span className="header-link" onClick={logout} style={{ opacity: 0.7 }}>
              Logout
            </span>
          </>
        ) : (
          <span 
            className="btn-primary" 
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            onClick={() => setCurrentPage('login')}
          >
            Sign In
          </span>
        )}
      </nav>
    </header>
  );
}
