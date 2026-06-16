import React, { useState, useContext } from 'react';
import { AppContext } from '../App';

export default function Checkout() {
  const { cart, clearCart, user, API_URL, showToast, setCurrentPage } = useContext(AppContext);

  // Checkout Steps: 'shipping', 'payment', 'success'
  const [step, setStep] = useState('shipping');
  const [orderId, setOrderId] = useState(null);

  // Form States
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('Card'); // 'Card' or 'COD'
  const [cardDetails, setCardDetails] = useState({
    name: user ? user.name : '',
    number: '',
    expiry: '',
    cvv: ''
  });

  const [processing, setProcessing] = useState(false);

  // Cart prices calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = Number((subtotal * 0.15).toFixed(2));
  const shipping = subtotal > 500 ? 0 : 15;
  const total = Number((subtotal + tax + shipping).toFixed(2));

  // Handle Shipping Submit
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const { address, city, postalCode, country } = shippingAddress;
    if (!address || !city || !postalCode || !country) {
      showToast('Please fill all shipping fields', 'error');
      return;
    }
    setStep('payment');
  };

  // Place Order API call
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'Card') {
      const { name, number, expiry, cvv } = cardDetails;
      if (!name || !number || !expiry || !cvv) {
        showToast('Please complete your card details', 'error');
        return;
      }
    }

    try {
      setProcessing(true);
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          items: cart,
          shippingAddress,
          paymentMethod,
          itemsPrice: subtotal,
          taxPrice: tax,
          shippingPrice: shipping,
          totalPrice: total
        })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Order submission failed');

      setOrderId(data._id);
      clearCart();
      showToast('Order placed successfully!', 'success');
      setStep('success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', marginTop: '3rem' }}>
        <h3>Your Cart is Empty</h3>
        <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setCurrentPage('shop')}>
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '2.5rem', maxWidth: '1000px', marginLeft: 'auto', marginRight: 'auto' }}>
      
      {/* Wizard Step Breadcrumbs */}
      {step !== 'success' && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ 
              width: '30px', 
              height: '30px', 
              borderRadius: '50%', 
              background: 'var(--accent-cyan)', 
              color: '#fff',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>1</span>
            <span style={{ fontWeight: step === 'shipping' ? '600' : '400', color: step === 'shipping' ? '#fff' : 'var(--text-muted)' }}>Shipping</span>
          </div>
          <div style={{ width: '50px', height: '1px', background: 'var(--border-glass)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ 
              width: '30px', 
              height: '30px', 
              borderRadius: '50%', 
              background: step === 'payment' ? 'var(--accent-cyan)' : 'var(--bg-deep)', 
              border: step === 'payment' ? 'none' : '1px solid var(--border-glass)',
              color: step === 'payment' ? '#fff' : 'var(--text-muted)',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>2</span>
            <span style={{ fontWeight: step === 'payment' ? '600' : '400', color: step === 'payment' ? '#fff' : 'var(--text-muted)' }}>Payment</span>
          </div>
        </div>
      )}

      {/* STEP 1: SHIPPING DETAILS FORM */}
      {step === 'shipping' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Delivery Address</h3>
            <form onSubmit={handleShippingSubmit}>
              <div className="form-group">
                <label>Street Address</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="123 Cyberpunk St"
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>City</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Neo City"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="400001"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Country</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="United States"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="submit" className="btn-primary">
                  Continue to Payment
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </div>
            </form>
          </div>

          <aside className="glass-panel" style={{ padding: '2rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Your Bag</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              {cart.map(item => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.name} (x{item.quantity})</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <span>Total Cost</span>
              <span style={{ color: 'var(--accent-cyan)' }}>${total}</span>
            </div>
          </aside>
        </div>
      )}

      {/* STEP 2: PAYMENT METHOD & CREDIT CARD GRAPHIC */}
      {step === 'payment' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Select Payment Method</h3>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <div 
                className="glass-panel" 
                style={{ 
                  flex: 1, 
                  padding: '1rem', 
                  cursor: 'pointer', 
                  borderColor: paymentMethod === 'Card' ? 'var(--accent-cyan)' : 'var(--border-glass)',
                  textAlign: 'center',
                  background: paymentMethod === 'Card' ? 'rgba(6,182,212,0.05)' : 'transparent'
                }}
                onClick={() => setPaymentMethod('Card')}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>💳</div>
                <strong>Credit Card</strong>
              </div>

              <div 
                className="glass-panel" 
                style={{ 
                  flex: 1, 
                  padding: '1rem', 
                  cursor: 'pointer', 
                  borderColor: paymentMethod === 'COD' ? 'var(--accent-cyan)' : 'var(--border-glass)',
                  textAlign: 'center',
                  background: paymentMethod === 'COD' ? 'rgba(6,182,212,0.05)' : 'transparent'
                }}
                onClick={() => setPaymentMethod('COD')}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>💵</div>
                <strong>Cash on Delivery</strong>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder}>
              {paymentMethod === 'Card' ? (
                <div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      placeholder="Jane Doe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, '').substring(0, 16) })}
                      placeholder="4111 2222 3333 4444"
                      required
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Expiry (MM/YY)</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value.substring(0, 5) })}
                        placeholder="12/28"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input 
                        type="password" 
                        className="form-control"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').substring(0, 3) })}
                        placeholder="***"
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-glass)', borderRadius: '8px', marginBottom: '2rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    You will pay the full amount of <strong>${total}</strong> in cash upon delivery of your products. No online verification is required.
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setStep('shipping')}>
                  Back
                </button>
                <button type="submit" className="btn-primary" disabled={processing}>
                  {processing ? 'Processing...' : `Pay & Place Order $${total}`}
                </button>
              </div>
            </form>
          </div>

          {/* Right: Glass Credit Card Mockup Graphic */}
          {paymentMethod === 'Card' && (
            <div 
              className="glass-panel pulsing-border" 
              style={{ 
                height: '220px', 
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(6, 182, 212, 0.4) 100%)',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: '#fff',
                position: 'sticky',
                top: '100px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Chip Icon */}
                <div style={{ width: '45px', height: '35px', borderRadius: '4px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: '1px solid #b45309' }}></div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, fontStyle: 'italic', color: 'rgba(255,255,255,0.8)' }}>PayCard</span>
              </div>

              {/* Card number display format */}
              <div style={{ fontSize: '1.4rem', fontFamily: 'monospace', letterSpacing: '0.15em', textShadow: '0 2px 4px rgba(0,0,0,0.5)', margin: '1.5rem 0' }}>
                {cardDetails.number 
                  ? cardDetails.number.replace(/(.{4})/g, '$1 ').trim()
                  : '•••• •••• •••• ••••'}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem' }}>Card Holder</div>
                  <div style={{ fontWeight: '600' }}>{cardDetails.name || 'JANE DOE'}</div>
                </div>
                <div>
                  <div style={{ textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem' }}>Expires</div>
                  <div style={{ fontWeight: '600' }}>{cardDetails.expiry || 'MM/YY'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: SUCCESS ANIMATED CONFIRMATION */}
      {step === 'success' && (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'rgba(16,185,129,0.15)', 
            border: '2px solid var(--accent-emerald)',
            color: 'var(--accent-emerald)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto 2rem'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>

          <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Order Confirmed!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Thank you for shopping with Shopez.</p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-dark)', marginBottom: '2.5rem' }}>
            Your Order ID is: <strong style={{ color: 'var(--accent-purple)' }}>{orderId}</strong>
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <button className="btn-primary" onClick={() => setCurrentPage('dashboard')}>
              Go to Dashboard
            </button>
            <button className="btn-secondary" onClick={() => setCurrentPage('shop')}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
