import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/authService';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { admin, loginAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (admin) {
      navigate('/admin', { replace: true });
    }
  }, [admin, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await login({ email, password });
      loginAdmin(data);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: 'linear-gradient(135deg, #0d1b2a 0%, #1b2a3b 60%, #f5a623 100%)' }}
    >
      <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '420px' }}>
        {/* Card Header */}
        <div
          className="card-header text-center py-4 border-0"
          style={{ background: '#0d1b2a', borderRadius: '0.375rem 0.375rem 0 0' }}
        >
          <h2 className="mb-0 fw-bold" style={{ color: '#f5a623', letterSpacing: '1px' }}>
            🐝 EventHive
          </h2>
          <p className="mb-0 mt-1 text-white-50 small">Admin Portal</p>
        </div>

        {/* Card Body */}
        <div className="card-body p-4" style={{ background: '#1b2a3b' }}>
          <h5 className="text-white mb-4 text-center fw-semibold">Sign In to Dashboard</h5>

          {error && (
            <div className="alert alert-danger d-flex align-items-center py-2 px-3" role="alert">
              <span className="me-2">⚠️</span>
              <span className="small">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-white-50 small mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="form-control"
                placeholder="admin@eventhive.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="username"
                style={{
                  background: '#0d1b2a',
                  border: '1px solid #2e4057',
                  color: '#fff',
                }}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="form-label text-white-50 small mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className="form-control"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
                style={{
                  background: '#0d1b2a',
                  border: '1px solid #2e4057',
                  color: '#fff',
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn w-100 fw-semibold py-2"
              disabled={loading}
              style={{
                background: '#f5a623',
                color: '#0d1b2a',
                border: 'none',
                fontSize: '1rem',
              }}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Signing In…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <div
          className="card-footer text-center py-2 border-0"
          style={{ background: '#152232', borderRadius: '0 0 0.375rem 0.375rem' }}
        >
          <small className="text-white-50">EventHive Admin &copy; {new Date().getFullYear()}</small>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
