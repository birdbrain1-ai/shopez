import React, { useState, useContext } from 'react';
import { AppContext } from '../App';

export default function Login({ type }) {
  const { login, register, setCurrentPage } = useContext(AppContext);
  const [isLoginView, setIsLoginView] = useState(type === 'login');

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI interaction states
  const [loading, setLoading] = useState(false);
  const [errorShake, setErrorShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoginView && password !== confirmPassword) {
      triggerError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      if (isLoginView) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      triggerError();
    } finally {
      setLoading(false);
    }
  };

  const triggerError = (msg) => {
    setErrorShake(true);
    setTimeout(() => {
      setErrorShake(false);
    }, 500);
  };



  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', padding: '2rem' }}>
      <div 
        className={`glass-panel ${errorShake ? 'shake-input' : ''}`} 
        style={{ 
          maxWidth: '450px', 
          width: '100%', 
          padding: '2.5rem',
          position: 'relative'
        }}
      >
        <h2 className="text-gradient" style={{ fontSize: '2.2rem', textAlign: 'center', marginBottom: '2rem', fontWeight: 800 }}>
          {isLoginView ? 'Welcome Back' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit}>
          {!isLoginView && (
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLoginView && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input 
                type="password" 
                className="form-control"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem', height: '48px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : isLoginView ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* View Toggle */}
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isLoginView ? "Don't have an account?" : "Already have an account?"}{' '}
          <span 
            style={{ color: 'var(--accent-cyan)', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => setIsLoginView(!isLoginView)}
          >
            {isLoginView ? 'Sign up' : 'Sign in'}
          </span>
        </div>


      </div>
    </div>
  );
}
