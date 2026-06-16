import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../App';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { setCurrentPage, viewProduct, API_URL, addToCart } = useContext(AppContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        if (res.ok) {
          // Take first 3 products as featured
          setFeaturedProducts(data.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Animated Hero Section */}
      <section 
        className="glass-panel" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '3rem', 
          padding: '3.5rem', 
          alignItems: 'center', 
          marginBottom: '5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ zIndex: 2 }}>
          <span 
            className="text-gradient" 
            style={{ 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              fontSize: '0.9rem', 
              letterSpacing: '0.15em', 
              display: 'inline-block',
              marginBottom: '1rem' 
            }}
          >
            Ultimate Sound Experience
          </span>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            AeroSound <br /><span className="text-gradient">Max Edition</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Immerse yourself in flawless audio. Hybrid Active Noise Cancellation, high-resolution spatial audio drivers, and a breathtaking 45-hour battery life.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" onClick={() => setCurrentPage('shop')}>
              Shop Catalog
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            {featuredProducts[1] && (
              <button className="btn-secondary" onClick={() => viewProduct(featuredProducts[1]._id)}>
                Quick View
              </button>
            )}
          </div>
        </div>

        {/* Hero Product Showcase Box */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          {/* Decorative glowing background rings */}
          <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', filter: 'blur(30px)', zIndex: 1 }}></div>
          <div style={{ position: 'absolute', width: '250px', height: '250px', borderRadius: '50%', border: '1px dashed rgba(168,85,247,0.15)', zIndex: 1, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
          
          <img 
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" 
            alt="AeroSound Max" 
            style={{ 
              width: '100%', 
              maxWidth: '380px', 
              height: 'auto', 
              objectFit: 'contain', 
              filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))',
              zIndex: 2,
              animation: 'bounceHero 6s ease-in-out infinite' 
            }}
          />
          
          {/* Keyframe simulation in JS style tag */}
          <style>{`
            @keyframes bounceHero {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-12px); }
            }
          `}</style>
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ marginBottom: '5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', textAlign: 'center' }}>
          Explore Our <span className="text-gradient">Categories</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
          {[
            { name: 'Laptops', icon: '💻', count: '12 items' },
            { name: 'Audio', icon: '🎧', count: '45 items' },
            { name: 'Wearables', icon: '⌚', count: '18 items' },
            { name: 'Phones', icon: '📱', count: '8 items' },
            { name: 'Accessories', icon: '🔌', count: '15 items' }
          ].map(cat => (
            <div 
              key={cat.name} 
              className="glass-panel" 
              style={{ padding: '1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
              onClick={() => setCurrentPage('shop')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-glass)';
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{cat.icon}</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{cat.name}</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Drops</span>
            <h2 style={{ fontSize: '1.8rem' }}>Featured <span className="text-gradient">Gear</span></h2>
          </div>
          <span className="header-link" onClick={() => setCurrentPage('shop')} style={{ fontSize: '0.95rem' }}>
            View all products &rarr;
          </span>
        </div>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="product-grid">
            {featuredProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
