import React, { useContext } from 'react';
import { AppContext } from '../App';

export default function ProductCard({ product }) {
  const { viewProduct, addToCart } = useContext(AppContext);

  // Render Star Ratings
  const renderStars = (rating = 5) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(
          <svg key={i} className="star-icon" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="star-icon star-empty" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        );
      }
    }
    return stars;
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="glass-panel product-card">
      <div className="product-card-img" onClick={() => viewProduct(product._id)} style={{ cursor: 'pointer' }}>
        <img src={product.image} alt={product.name} />
        {isOutOfStock ? (
          <span className="product-card-badge" style={{ backgroundColor: 'rgba(236,72,153,0.2)', borderColor: 'var(--accent-pink)', color: 'var(--accent-pink)' }}>
            Out of Stock
          </span>
        ) : product.stock <= 5 ? (
          <span className="product-card-badge" style={{ backgroundColor: 'rgba(245,158,11,0.2)', borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' }}>
            Only {product.stock} Left!
          </span>
        ) : (
          <span className="product-card-badge">{product.category}</span>
        )}
      </div>

      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <h3 
          className="product-card-title" 
          onClick={() => viewProduct(product._id)}
          style={{ cursor: 'pointer', transition: 'color 0.2s' }}
          onMouseEnter={(e) => e.target.style.color = 'var(--accent-cyan)'}
          onMouseLeave={(e) => e.target.style.color = '#fff'}
        >
          {product.name}
        </h3>
        
        <div className="product-card-rating">
          {renderStars(product.rating)}
          <span className="product-card-rating-text">({product.reviews ? product.reviews.length : 0})</span>
        </div>

        <div className="product-card-footer">
          <span className="product-card-price">${product.price}</span>
          <button 
            className="btn-card-add" 
            onClick={() => !isOutOfStock && addToCart(product)}
            disabled={isOutOfStock}
            style={{ 
              opacity: isOutOfStock ? 0.3 : 1,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
            title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
