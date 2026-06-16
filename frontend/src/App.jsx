import React, { createContext, useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

export const AppContext = createContext();

export default function App() {
  // Navigation Routing State
  const [currentPage, setCurrentPage] = useState('home');
  const [activeProductId, setActiveProductId] = useState(null);

  // Auth State
  const [user, setUser] = useState(null);

  // Cart State
  const [cart, setCart] = useState([]);

  // UI States
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // API Base URL (uses environment variable for production, falls back to localhost)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Load user and cart from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('shopez_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedCart = localStorage.getItem('shopez_cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Sync Cart to local storage
  useEffect(() => {
    localStorage.setItem('shopez_cart', JSON.stringify(cart));
  }, [cart]);

  // Toast helper
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Auth Operations
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      setUser(data);
      localStorage.setItem('shopez_user', JSON.stringify(data));
      showToast(`Welcome back, ${data.name}!`, 'success');
      setCurrentPage('home');
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      setUser(data);
      localStorage.setItem('shopez_user', JSON.stringify(data));
      showToast(`Account created, welcome ${data.name}!`, 'success');
      setCurrentPage('home');
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopez_user');
    showToast('Logged out successfully', 'info');
    setCurrentPage('home');
  };

  // Cart Operations
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product._id);
      if (existingItem) {
        const newQty = Math.min(product.stock, existingItem.quantity + quantity);
        if (newQty === existingItem.quantity && existingItem.quantity >= product.stock) {
          showToast(`Cannot add more. Stock limit of ${product.stock} reached.`, 'error');
          return prevCart;
        }
        showToast(`Updated ${product.name} quantity in Cart!`, 'success');
        return prevCart.map(item => 
          item.productId === product._id ? { ...item, quantity: newQty } : item
        );
      }
      
      showToast(`${product.name} added to Cart!`, 'success');
      return [...prevCart, {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        quantity: Math.min(product.stock, quantity)
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId, qty) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: Math.max(1, Math.min(item.stock, qty)) } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // View Details Router helper
  const viewProduct = (productId) => {
    setActiveProductId(productId);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render current page component
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'shop':
        return <Shop />;
      case 'product-detail':
        return <ProductDetails productId={activeProductId} />;
      case 'cart':
        return <Cart />;
      case 'checkout':
        return <Checkout />;
      case 'dashboard':
        return <Dashboard />;
      case 'login':
      case 'register':
        return <Login type={currentPage} />;
      default:
        return <Home />;
    }
  };

  const contextValue = {
    API_URL,
    currentPage,
    setCurrentPage,
    activeProductId,
    viewProduct,
    user,
    login,
    register,
    logout,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toast,
    showToast,
    searchQuery,
    setSearchQuery
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="app-container">
        <Header />
        
        <main className="main-content">
          {renderPage()}
        </main>

        <Footer />

        {/* Global Toast Alert */}
        {toast && (
          <div className={`alert-toast ${toast.type}`}>
            {toast.type === 'success' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            )}
            {toast.type === 'error' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            )}
            {toast.type === 'info' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            )}
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
}
