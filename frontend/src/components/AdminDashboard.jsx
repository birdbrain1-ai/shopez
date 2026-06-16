import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';

export default function AdminDashboard() {
  const { user, API_URL, showToast } = useContext(AppContext);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'products', 'orders'

  // Product Form Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Laptops',
    image: '',
    stock: ''
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user?.token}`
  };

  // Fetch Dashboard Stats, Products and Orders
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Stats
      const statsRes = await fetch(`${API_URL}/api/stats`, { headers });
      const statsData = await statsRes.json();
      if (statsRes.ok) setStats(statsData);

      // Fetch Products
      const prodRes = await fetch(`${API_URL}/api/products`);
      const prodData = await prodRes.json();
      if (prodRes.ok) setProducts(prodData);

      // Fetch Orders
      const orderRes = await fetch(`${API_URL}/api/orders`, { headers });
      const orderData = await orderRes.json();
      if (orderRes.ok) setOrders(orderData);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      fetchData();
    }
  }, [user]);

  // Handle Product Add / Edit submit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.description || !formData.image || formData.stock === '') {
      showToast('Please fill all fields', 'error');
      return;
    }

    try {
      const url = modalType === 'add' 
        ? `${API_URL}/api/products` 
        : `${API_URL}/api/products/${selectedProductId}`;
      const method = modalType === 'add' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Action failed');

      showToast(`Product ${modalType === 'add' ? 'created' : 'updated'} successfully!`, 'success');
      setShowModal(false);
      setFormData({ name: '', price: '', description: '', category: 'Laptops', image: '', stock: '' });
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');

      showToast('Product deleted successfully', 'success');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Open Edit Product Modal
  const openEditModal = (product) => {
    setModalType('edit');
    setSelectedProductId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      stock: product.stock
    });
    setShowModal(true);
  };

  // Open Add Product Modal
  const openAddModal = () => {
    setModalType('add');
    setFormData({ name: '', price: '', description: '', category: 'Laptops', image: '', stock: '' });
    setShowModal(true);
  };

  // Update order status
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      showToast(`Order status updated to ${newStatus}`, 'success');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '2rem' }}>Administrator Console</h2>
        
        {/* Dashboard Tabs */}
        <div className="glass-panel" style={{ display: 'flex', padding: '0.25rem', borderRadius: '10px' }}>
          <button 
            className="btn-secondary" 
            style={{ 
              border: 'none', 
              background: activeTab === 'stats' ? 'rgba(6,182,212,0.15)' : 'transparent',
              color: activeTab === 'stats' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              padding: '0.5rem 1rem',
              borderRadius: '8px'
            }}
            onClick={() => setActiveTab('stats')}
          >
            Insights
          </button>
          <button 
            className="btn-secondary" 
            style={{ 
              border: 'none', 
              background: activeTab === 'products' ? 'rgba(6,182,212,0.15)' : 'transparent',
              color: activeTab === 'products' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              padding: '0.5rem 1rem',
              borderRadius: '8px'
            }}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button 
            className="btn-secondary" 
            style={{ 
              border: 'none', 
              background: activeTab === 'orders' ? 'rgba(6,182,212,0.15)' : 'transparent',
              color: activeTab === 'orders' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              padding: '0.5rem 1rem',
              borderRadius: '8px'
            }}
            onClick={() => setActiveTab('orders')}
          >
            Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* INSIGHTS VIEW */}
      {activeTab === 'stats' && stats && (
        <div>
          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Sales</p>
              <h3 style={{ fontSize: '2.2rem' }}>${stats.totalSales}</h3>
              <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))', borderRadius: '2px', marginTop: '1rem' }}></div>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Orders</p>
              <h3 style={{ fontSize: '2.2rem' }}>{stats.ordersCount}</h3>
              <div style={{ height: '4px', background: 'var(--accent-purple)', borderRadius: '2px', marginTop: '1rem' }}></div>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Products Seeded</p>
              <h3 style={{ fontSize: '2.2rem' }}>{stats.productsCount}</h3>
              <div style={{ height: '4px', background: 'var(--accent-cyan)', borderRadius: '2px', marginTop: '1rem' }}></div>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Users</p>
              <h3 style={{ fontSize: '2.2rem' }}>{stats.usersCount}</h3>
              <div style={{ height: '4px', background: 'var(--accent-emerald)', borderRadius: '2px', marginTop: '1rem' }}></div>
            </div>
          </div>

          {/* Sales Breakdown Table */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Sales By Category</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {Object.entries(stats.categorySales || {}).map(([cat, total]) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '600' }}>{cat}</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>${total.toFixed(2)}</span>
                </div>
              ))}
              {Object.keys(stats.categorySales || {}).length === 0 && (
                <p style={{ color: 'var(--text-muted)' }}>No sales recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS MANAGER VIEW */}
      {activeTab === 'products' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.4rem' }}>Product Catalog ({products.length})</h3>
            <button className="btn-primary" onClick={openAddModal}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add Product
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>Image</th>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Price</th>
                  <th style={{ padding: '1rem' }}>Stock</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'background 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.01)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding: '1rem' }}>
                      <img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>{p.name}</td>
                    <td style={{ padding: '1rem' }}>{p.category}</td>
                    <td style={{ padding: '1rem', color: 'var(--accent-cyan)' }}>${p.price}</td>
                    <td style={{ padding: '1rem' }}>{p.stock}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => openEditModal(p)}>Edit</button>
                        <button className="btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ORDERS MANAGER VIEW */}
      {activeTab === 'orders' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Customer Orders</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>Order ID</th>
                  <th style={{ padding: '1rem' }}>Customer</th>
                  <th style={{ padding: '1rem' }}>Items</th>
                  <th style={{ padding: '1rem' }}>Total</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--accent-purple)' }}>{o._id}</td>
                    <td style={{ padding: '1rem' }}>
                      <div>{o.userName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.shippingAddress?.city}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {o.items.map(item => (
                        <div key={item.productId} style={{ fontSize: '0.85rem' }}>
                          {item.name} <span style={{ color: 'var(--text-muted)' }}>x {item.quantity}</span>
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>${o.totalPrice}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: o.status === 'Delivered' ? 'rgba(16,185,129,0.15)' : o.status === 'Shipped' ? 'rgba(6,182,212,0.15)' : 'rgba(245,158,11,0.15)',
                        color: o.status === 'Delivered' ? 'var(--accent-emerald)' : o.status === 'Shipped' ? 'var(--accent-cyan)' : 'var(--accent-amber)',
                        border: `1px solid ${o.status === 'Delivered' ? 'var(--accent-emerald)' : o.status === 'Shipped' ? 'var(--accent-cyan)' : 'var(--accent-amber)'}`
                      }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <select 
                        value={o.status}
                        onChange={(e) => handleOrderStatusChange(o._id, e.target.value)}
                        className="form-control"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem', width: 'auto', background: 'var(--bg-deep)' }}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCT FORM MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '1rem' }}>
          <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', padding: '2rem', background: '#0a0f1d' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }} className="text-gradient">
              {modalType === 'add' ? 'Add New Product' : 'Modify Product'}
            </h3>
            
            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="e.g. ApexBuds Pro" 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                    placeholder="e.g. 149" 
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={formData.stock} 
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })} 
                    placeholder="e.g. 40" 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    className="form-control" 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Laptops">Laptops</option>
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Phones">Phones</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.image} 
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
                  placeholder="e.g. https://images.unsplash.com/..." 
                />
              </div>

              <div className="form-group">
                <label>Product Description</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="Detailed specs and descriptions..." 
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {modalType === 'add' ? 'Create Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
