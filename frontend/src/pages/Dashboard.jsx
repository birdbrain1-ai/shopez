import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import AdminDashboard from '../components/AdminDashboard';

export default function Dashboard() {
  const { user, API_URL, showToast, setCurrentPage } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdminView, setIsAdminView] = useState(user?.isAdmin || false);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/orders/myorders`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading your orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !isAdminView) {
      fetchUserOrders();
    }
  }, [user, isAdminView]);

  if (!user) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', marginTop: '3rem' }}>
        <h3>Access Denied</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You must sign in to access your dashboard.</p>
        <button className="btn-primary" onClick={() => setCurrentPage('login')}>Sign In</button>
      </div>
    );
  }

  // Render Admin Console if toggled
  if (user.isAdmin && isAdminView) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button className="btn-secondary" style={{ fontSize: '0.85rem' }} onClick={() => setIsAdminView(false)}>
            Switch to Customer View
          </button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div style={{ marginTop: '2.5rem' }}>
      
      {/* Dashboard Top Header */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Customer Profile</span>
          <h2 style={{ fontSize: '2rem', marginTop: '0.25rem' }}>Welcome, {user.name}</h2>
          <p style={{ color: 'var(--accent-cyan)', fontSize: '0.95rem', marginTop: '0.25rem' }}>{user.email}</p>
        </div>

        {user.isAdmin && (
          <button className="btn-primary" onClick={() => setIsAdminView(true)}>
            Open Admin Console
          </button>
        )}
      </div>

      {/* Orders Section */}
      <div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Order History</h3>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't placed any orders yet.</p>
            <button className="btn-primary" onClick={() => setCurrentPage('shop')}>
              Browse Shop
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {orders.map(order => (
              <div key={order._id} className="glass-panel" style={{ padding: '2rem' }}>
                {/* Order Meta Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>ORDER ID</span>
                    <div style={{ color: 'var(--accent-purple)', fontWeight: '600', fontSize: '0.9rem' }}>{order._id}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>DATE</span>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                      {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>TOTAL AMOUNT</span>
                    <div style={{ color: 'var(--accent-cyan)', fontWeight: '700', fontSize: '1.1rem' }}>${order.totalPrice}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>STATUS</span>
                    <div style={{ marginTop: '0.2rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: order.status === 'Delivered' ? 'rgba(16,185,129,0.15)' : order.status === 'Shipped' ? 'rgba(6,182,212,0.15)' : 'rgba(245,158,11,0.15)',
                        color: order.status === 'Delivered' ? 'var(--accent-emerald)' : order.status === 'Shipped' ? 'var(--accent-cyan)' : 'var(--accent-amber)',
                        border: `1px solid ${order.status === 'Delivered' ? 'var(--accent-emerald)' : order.status === 'Shipped' ? 'var(--accent-cyan)' : 'var(--accent-amber)'}`
                      }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grid Content: Items & Status progress bar */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem', alignItems: 'center' }}>
                  {/* Left: Items list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {order.items.map(item => (
                      <div key={item.productId} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>{item.name}</strong>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            ${item.price} x {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right: Progress tracker bar */}
                  <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textAlign: 'center', fontWeight: '600' }}>
                      Delivery Progress
                    </div>
                    
                    {/* Visual bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '0.5rem' }}>
                      {/* Connection Line */}
                      <div style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        left: '10%', 
                        right: '10%', 
                        height: '2px', 
                        background: order.status === 'Delivered' ? 'var(--accent-emerald)' : order.status === 'Shipped' ? 'linear-gradient(90deg, var(--accent-cyan) 50%, var(--border-glass) 50%)' : 'var(--border-glass)',
                        zIndex: 1 
                      }}></div>

                      {/* Placed Dot */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', zIndex: 2 }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent-cyan)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span style={{ fontSize: '0.65rem', color: '#fff', fontWeight: '500' }}>Placed</span>
                      </div>

                      {/* Shipped Dot */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', zIndex: 2 }}>
                        <div style={{ 
                          width: '22px', 
                          height: '22px', 
                          borderRadius: '50%', 
                          background: (order.status === 'Shipped' || order.status === 'Delivered') ? 'var(--accent-cyan)' : 'var(--bg-deep)', 
                          border: (order.status === 'Shipped' || order.status === 'Delivered') ? 'none' : '1px solid var(--border-glass)',
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center' 
                        }}>
                          {(order.status === 'Shipped' || order.status === 'Delivered') ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          ) : null}
                        </div>
                        <span style={{ fontSize: '0.65rem', color: (order.status === 'Shipped' || order.status === 'Delivered') ? '#fff' : 'var(--text-dark)' }}>Shipped</span>
                      </div>

                      {/* Delivered Dot */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', zIndex: 2 }}>
                        <div style={{ 
                          width: '22px', 
                          height: '22px', 
                          borderRadius: '50%', 
                          background: order.status === 'Delivered' ? 'var(--accent-emerald)' : 'var(--bg-deep)', 
                          border: order.status === 'Delivered' ? 'none' : '1px solid var(--border-glass)',
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center' 
                        }}>
                          {order.status === 'Delivered' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          ) : null}
                        </div>
                        <span style={{ fontSize: '0.65rem', color: order.status === 'Delivered' ? 'var(--accent-emerald)' : 'var(--text-dark)' }}>Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
