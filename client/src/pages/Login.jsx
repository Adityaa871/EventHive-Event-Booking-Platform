import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/common/ErrorMessage';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Return to previous page or default role dashboard
  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setError('Please provide both your registered email address and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login({ email: trimmedEmail, password });
      toast.success(`Welcome back, ${user.name}!`);

      if (from) {
        // If they requested a page and have appropriate role
        if (from.startsWith('/admin') && user.role !== 'admin') {
          navigate('/my-bookings', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/my-bookings', { replace: true });
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Invalid email address or password. Please verify and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Quick autofill buttons for evaluation/testing
  const fillDemoCredentials = (role) => {
    setError('');
    if (role === 'admin') {
      setEmail('admin@eventhive.com');
      setPassword('Admin@12345');
    } else {
      setEmail('demo@eventhive.com');
      setPassword('User@12345');
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5 px-3"
      style={{ minHeight: 'calc(100vh - 160px)', backgroundColor: 'var(--bg-canvas)' }}
    >
      <div
        className="card-tactile p-4 p-md-5 w-100"
        style={{
          maxWidth: '460px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {/* Wordmark & Header */}
        <div className="text-center mb-4">
          <Link
            to="/"
            className="d-inline-flex align-items-center mb-3 text-decoration-none"
            style={{
              color: 'var(--text-primary)',
              fontWeight: 800,
              fontSize: '22px',
              letterSpacing: '-0.04em',
            }}
          >
            <span>Event</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500, marginLeft: '2px' }}>Hive</span>
          </Link>

          <h1 className="h4 fw-bold tracking-tight mb-2">Sign in to your account</h1>
          <p className="text-secondary small mb-0">
            Access your event reservations, track milestones, and manage invoices.
          </p>
        </div>

        {/* Quick Demo Credentials Tabs */}
        <div
          className="p-3 mb-4 rounded border"
          style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}
        >
          <span
            className="text-uppercase fw-bold text-muted d-block mb-2 text-center"
            style={{ fontSize: '11px', letterSpacing: '0.05em' }}
          >
            Quick Demo Credentials
          </span>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary btn-tactile w-50 bg-white"
              onClick={() => fillDemoCredentials('user')}
              title="Autofill customer demo account"
              style={{ fontSize: '12px' }}
            >
              <i className="bi bi-person me-1" />
              Client Account
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary btn-tactile w-50 bg-white"
              onClick={() => fillDemoCredentials('admin')}
              title="Autofill administrator demo account"
              style={{ fontSize: '12px' }}
            >
              <i className="bi bi-shield-lock me-1" />
              Admin Portal
            </button>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email Address */}
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <i className="bi bi-envelope" />
              </span>
              <input
                id="email"
                type="email"
                className="form-control border-start-0 ps-0"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label mb-0" htmlFor="password">
                Password
              </label>
            </div>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <i className="bi bi-lock" />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control border-start-0 border-end-0 px-0"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="input-group-text bg-white border-start-0 text-secondary"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-tactile w-100 py-2 fw-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Authenticating…
              </>
            ) : (
              <>
                Sign In
                <i className="bi bi-arrow-right ms-2 icon-nudge" aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-top text-center small text-secondary">
          Don't have an EventHive account?{' '}
          <Link to="/register" className="fw-semibold text-dark text-decoration-none">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
