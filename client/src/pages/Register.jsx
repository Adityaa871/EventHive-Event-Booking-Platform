import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/common/ErrorMessage';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, phone, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (phone && !/^[6-9]\d{9}$/.test(phone.trim())) {
      setError('Please provide a valid 10-digit Indian mobile number.');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      navigate('/my-bookings', { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Failed to create account. Please try again.'
      );
    } finally {
      setLoading(false);
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
        <div className="text-center mb-4">
          <span
            className="text-uppercase small fw-bold text-muted mb-2 d-block"
            style={{ letterSpacing: '0.08em', fontSize: '11px' }}
          >
            Client Registration
          </span>
          <h1 className="h4 fw-bold tracking-tight mb-2">Create an Account</h1>
          <p className="text-secondary small mb-0">
            Keep track of reservations, reschedule dates, and save favorite packages.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label" htmlFor="name">
              Full Name <span className="text-danger">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="e.g. Priya Sharma"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Email Address <span className="text-danger">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="phone">
              Mobile Number (10 Digits)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="form-control"
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="password">
              Password (min. 6 chars) <span className="text-danger">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password <span className="text-danger">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
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
                Creating Account…
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-top text-center small text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="fw-semibold text-dark text-decoration-none">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
