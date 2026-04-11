import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const AuthPage = ({ onNavigate }) => {
  const { loginUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin
      ? 'http://localhost:8000/login'
      : 'http://localhost:8000/register';

    const payload = isLogin
      ? { email, password }
      : { email, password, role };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Authentication failed');

      loginUser(data);
      onNavigate('home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand-area">
          <div className="auth-brand-icon">💎</div>
          <h1 className="auth-title">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="auth-subtitle">
            {isLogin
              ? 'Sign in to access your personal collection'
              : 'Join Roshni Creations and begin your journey'}
          </p>
        </div>

        {/* Error */}
        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Role Selector (only on Sign Up) */}
          {!isLogin && (
            <>
              <div className="auth-role-row">
                <button
                  type="button"
                  className={`role-card ${role === 'customer' ? 'selected' : ''}`}
                  onClick={() => setRole('customer')}
                >
                  <span className="role-icon">🛍️</span>
                  <span className="role-label">Customer</span>
                </button>
                <button
                  type="button"
                  className={`role-card ${role === 'admin' ? 'selected' : ''}`}
                  onClick={() => setRole('admin')}
                >
                  <span className="role-icon">👑</span>
                  <span className="role-label">Admin</span>
                </button>
              </div>
              <div className="auth-divider">or continue with email</div>
            </>
          )}

          {/* Email */}
          <div className="auth-input-group">
            <label htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              className="auth-input"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="auth-input-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              className="auth-input"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading && <span className="auth-spinner" />}
            {loading
              ? 'Processing...'
              : isLogin
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>

        {/* Toggle login/register */}
        <div className="auth-toggle">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button className="auth-toggle-btn" onClick={switchMode}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
