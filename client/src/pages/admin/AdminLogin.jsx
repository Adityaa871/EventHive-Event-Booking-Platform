import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/authService';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { admin, loginAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
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
      setError('Email address is required.');
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
        err?.response?.data?.message || err?.message || 'Invalid credentials. Please verify your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3 reveal-fade-up"
      style={{ backgroundColor: '#111113' }}
    >
      <div
        className="w-100"
        style={{
          maxWidth: '400px',
          backgroundColor: '#18181b',
          border: '1px solid #27272a',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Card Header */}
        <div
          className="p-4 text-center"
          style={{ borderBottom: '1px solid #27272a' }}
        >
          <div className="d-inline-flex align-items-center gap-2 mb-2">
            <span className="fw-bold text-white fs-5" style={{ letterSpacing: '-0.03em' }}>
              EventHive
            </span>
            <span
              className="badge"
              style={{
                backgroundColor: '#27272a',
                color: '#a1a1aa',
                fontSize: '10px',
                padding: '2px 6px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Portal
            </span>
          </div>
          <p className="small text-white-50 mb-0">Sign in to access inquiries and packages</p>
        </div>

        {/* Card Body */}
        <div className="p-4">
          {error && (
            <div
              className="alert d-flex align-items-center gap-2 py-2 px-3 mb-4 small"
              role="alert"
              style={{
                backgroundColor: '#2b1517',
                border: '1px solid #491b1f',
                color: '#f87171',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <i className="bi bi-exclamation-circle flex-shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-white-50 small mb-1">
                Email address
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
                  backgroundColor: '#111113',
                  border: '1px solid #27272a',
                  color: '#ffffff',
                }}
              />
            </div>

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
                  backgroundColor: '#111113',
                  border: '1px solid #27272a',
                  color: '#ffffff',
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-tactile w-100 py-2 fw-semibold"
              disabled={loading}
              style={{
                backgroundColor: '#ffffff',
                color: '#18181b',
                border: '1px solid #ffffff',
                fontSize: '14px',
              }}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Authenticating...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="text-center mt-4 pt-2">
            <Link
              to="/"
              className="text-white-50 small"
              style={{ textDecoration: 'none', transition: 'color 0.15s ease' }}
              onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.target.style.color = 'rgba(255, 255, 255, 0.5)')}
            >
              ← Back to public website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
