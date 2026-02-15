import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/api';
import './LoginPage.css';

/**
 * Login Component
 * Simple password-based authentication
 * Stores JWT token in localStorage
 * Redirects to /dashboard on successful login
 * 
 * IMPORTANT: Auth state is cleared on page load to require login each session
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear all auth state on page load
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!password.trim()) {
        throw new Error('Password is required');
      }

      const response = await login(password);

      if (response.success && response.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('tokenExpiry', response.expiresIn);

        // Clear form
        setPassword('');

        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
      } else {
        throw new Error('Login failed: Invalid response');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Code Library</h1>
        <p className="login-subtitle">Admin Login</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="login-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="login-footer">
          Protected admin area. JWT authentication required.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
