import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';

export default function ProductDetails({ productId }) {
  const { API_URL, addToCart, user, showToast } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/products/${productId}`);
      const data = await res.json();
      if (res.ok) {
        setProduct(data);
      } else {
        showToast(data.message || 'Product not found', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading product details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
      setQuantity(1);
    }
  }, [productId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment) {
      showToast('Please type a comment', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ rating, comment })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');

      showToast('Review submitted!', 'success');
      setComment('');
      setRating(5);
      fetchProduct(); // reload reviews
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const renderStars = (ratingVal = 5) => {
    const stars = [];
    const floorRating = Math.floor(ratingVal);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg 
          key={i} 
          className={`star-icon ${i > floorRating ? 'star-empty' : ''}`} 
          viewBox="0 0 24 24"
          style={{ width: '18px', height: '18px' }}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', marginTop: '3rem' }}>
        <h2>Product Not Found</h2>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div style={{ marginTop: '2.5rem' }}>
      {/* Product Information Split Section */}
      <section 
        className="glass-panel" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '3rem', 
          padding: '3rem',
          marginBottom: '4rem' 
        }}
      >
        {/* Left: Product Image */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.15)', borderRadius: '12px', padding: '1.5rem' }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ 
              width: '100%', 
              maxHeight: '450px', 
              objectFit: 'contain',
              borderRadius: '8px',
              filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.3))' 
            }} 
          />
        </div>

        {/* Right: Product Details */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className="text-gradient" style={{ fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex' }}>{renderStars(product.rating)}</div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {product.rating} / 5 ({product.reviews ? product.reviews.length : 0} reviews)
            </span>
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>${product.price}</h2>
          
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem', fontSize: '1rem' }}>
            {product.description}
          </p>

          {/* Stock status indicator */}
          <div style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Status:{' '}
            <strong style={{ color: isOutOfStock ? 'var(--accent-pink)' : product.stock <= 5 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
              {isOutOfStock ? 'Out Of Stock' : product.stock <= 5 ? `Low Stock (Only ${product.stock} left!)` : 'In Stock'}
            </strong>
          </div>

          {/* Quantity selector and Cart controls */}
          {!isOutOfStock && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-deep)', border: '1px solid var(--border-glass)', borderRadius: '8px', overflow: 'hidden' }}>
                <button 
                  className="btn-secondary" 
                  style={{ border: 'none', padding: '0.5rem 1rem', borderRadius: 0 }}
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <span style={{ width: '40px', textAlign: 'center', fontWeight: '600' }}>{quantity}</span>
                <button 
                  className="btn-secondary" 
                  style={{ border: 'none', padding: '0.5rem 1rem', borderRadius: 0 }}
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                >
                  +
                </button>
              </div>

              <button className="btn-primary" onClick={() => addToCart(product, quantity)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Add To Cart
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Review Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
        {/* Review list */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '2rem' }}>Customer Reviews</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev, index) => (
                <div key={index} style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong>{rev.user}</strong>
                    <div style={{ display: 'flex' }}>{renderStars(rev.rating)}</div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {rev.comment}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No reviews yet. Be the first to share your thoughts!</p>
            )}
          </div>
        </div>

        {/* Write a Review */}
        <div className="glass-panel" style={{ padding: '2.5rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Write a Review</h3>

          {user ? (
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Rating</label>
                <select 
                  className="form-control"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value="5">5 Star - Exceptional</option>
                  <option value="4">4 Star - Great</option>
                  <option value="3">3 Star - Average</option>
                  <option value="2">2 Star - Poor</option>
                  <option value="1">1 Star - Disastrous</option>
                </select>
              </div>

              <div className="form-group">
                <label>Comment</label>
                <textarea 
                  className="form-control"
                  rows="4"
                  placeholder="Share your experience with this product..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Submit Review
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-glass)', borderRadius: '8px' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>You must be registered or logged in to leave feedback.</p>
              <button className="btn-secondary" onClick={() => setCurrentPage('login')}>Sign In</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
