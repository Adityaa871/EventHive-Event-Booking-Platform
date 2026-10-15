import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@eventhive.com');
    setPassword('Admin@12345');
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '75vh' }}>
      <div className="card shadow-sm p-4 rounded-4 border-0" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="fs-1 text-warning mb-2">🔒</div>
          <h3 className="fw-bold">Admin Portal</h3>
          <p className="text-muted small">Sign in to manage event packages and booking leads</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@eventhive.com"
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-warning w-100 py-2 fw-bold text-dark mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 pt-3 border-top text-center">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary w-100 rounded-pill"
            onClick={fillDemoCredentials}
          >
            Use Demo Admin Credentials
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

