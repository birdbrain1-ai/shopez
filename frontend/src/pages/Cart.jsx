import React, { useContext } from 'react';
import { AppContext } from '../App';

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity, setCurrentPage, user, showToast } = useContext(AppContext);

  // Subtotal calculation
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = Number((subtotal * 0.15).toFixed(2));
  const shipping = subtotal === 0 ? 0 : subtotal > 500 ? 0 : 15;
  const total = Number((subtotal + tax + shipping).toFixed(2));

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }
    if (!user) {
      showToast('Please sign in to proceed to checkout', 'info');
      setCurrentPage('login');
      return;
    }
    setCurrentPage('checkout');
  };

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--text-dark)', marginBottom: '1.5rem' }}>
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>Cart is Empty</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You haven't added any products to your bag yet.</p>
          <button className="btn-primary" onClick={() => setCurrentPage('shop')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cart.map(item => (
              <div 
                key={item.productId} 
                className="glass-panel" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '1.5rem', 
                  gap: '1.5rem',
                  position: 'relative'
                }}
              >
                {/* Item Thumbnail */}
                <img 
                  src={item.image} 
                  alt={item.name} 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} 
                />

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.category}</span>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', marginTop: '0.2rem', marginBottom: '0.4rem' }}>{item.name}</h4>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>${item.price} each</span>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-deep)', border: '1px solid var(--border-glass)', borderRadius: '6px', overflow: 'hidden' }}>
                  <button 
                    className="btn-secondary" 
                    style={{ border: 'none', padding: '0.35rem 0.75rem', borderRadius: 0 }}
                    onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span style={{ width: '30px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600' }}>{item.quantity}</span>
                  <button 
                    className="btn-secondary" 
                    style={{ border: 'none', padding: '0.35rem 0.75rem', borderRadius: 0 }}
                    onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                {/* Subtotal price for this item */}
                <div style={{ width: '100px', textAlign: 'right', fontWeight: '700', fontSize: '1.1rem' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                {/* Remove Item Button */}
                <button 
                  className="btn-card-add" 
                  style={{ 
                    position: 'absolute', 
                    top: '0.5rem', 
                    right: '0.5rem', 
                    width: '24px', 
                    height: '24px', 
                    padding: 0,
                    background: 'transparent',
                    color: 'var(--text-dark)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-pink)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dark)'}
                  onClick={() => removeFromCart(item.productId)}
                  title="Remove from Cart"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary Card */}
          <aside className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>Order Summary</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Tax (15%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dark)', marginTop: '-0.5rem' }}>
                  Spend ${(500 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem', marginBottom: '2rem' }}>
              <strong style={{ fontSize: '1.1rem' }}>Total</strong>
              <strong style={{ fontSize: '1.25rem', color: 'var(--accent-cyan)' }}>${total.toFixed(2)}</strong>
            </div>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleCheckoutClick}>
              Proceed to Checkout
            </button>
            
            <button 
              className="btn-secondary" 
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }} 
              onClick={() => setCurrentPage('shop')}
            >
              Continue Shopping
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
