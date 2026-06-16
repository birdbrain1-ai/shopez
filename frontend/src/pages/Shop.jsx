import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const { API_URL, searchQuery, setSearchQuery } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(2000);
  const [sortBy, setSortBy] = useState('featured');

  // Categories list
  const categories = ['All', 'Laptops', 'Audio', 'Wearables', 'Phones', 'Accessories'];

  // Fetch products based on category / search query from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `${API_URL}/api/products`;
        const params = [];
        if (selectedCategory !== 'All') params.push(`category=${selectedCategory}`);
        if (searchQuery) params.push(`search=${encodeURIComponent(searchQuery)}`);
        
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setProducts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  // Apply price filter and client sorting
  useEffect(() => {
    let result = [...products];

    // Filter by Price Range
    result = result.filter(p => p.price <= priceRange);

    // Apply Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [products, priceRange, sortBy]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', marginTop: '2.5rem' }}>
      {/* Sidebar Filters */}
      <aside className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>Filters</h3>
        
        {/* Categories Filter */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categories</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {categories.map(cat => (
              <span 
                key={cat} 
                style={{ 
                  cursor: 'pointer', 
                  fontSize: '0.95rem', 
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  color: selectedCategory === cat ? 'var(--accent-cyan)' : 'var(--text-main)',
                  backgroundColor: selectedCategory === cat ? 'rgba(6,182,212,0.1)' : 'transparent',
                  fontWeight: selectedCategory === cat ? '600' : '400',
                  transition: 'all 0.2s'
                }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Price Range Slider */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Max Price</h4>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: '700', fontSize: '0.95rem' }}>${priceRange}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="2000" 
            step="50"
            value={priceRange} 
            onChange={(e) => setPriceRange(Number(e.target.value))}
            style={{ 
              width: '100%',
              accentColor: 'var(--accent-cyan)',
              background: 'var(--bg-deep)',
              height: '6px',
              borderRadius: '3px',
              outline: 'none'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dark)', marginTop: '0.4rem' }}>
            <span>$0</span>
            <span>$2000</span>
          </div>
        </div>

        {/* Clear Filters Button */}
        <button 
          className="btn-secondary" 
          style={{ width: '100%', fontSize: '0.85rem', padding: '0.6rem' }}
          onClick={() => {
            setSelectedCategory('All');
            setPriceRange(2000);
            setSortBy('featured');
            setSearchQuery('');
          }}
        >
          Reset Filters
        </button>
      </aside>

      {/* Product Grid & Top Bar */}
      <div>
        {/* Top bar */}
        <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredProducts.length}</strong> items
            {searchQuery && <span> for "{searchQuery}"</span>}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '0.4rem 1.5rem 0.4rem 0.75rem', background: 'var(--bg-card)', fontSize: '0.9rem' }}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No products found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="product-grid" style={{ marginTop: '0' }}>
            {filteredProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
