import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div
      className="d-flex align-items-center justify-content-center text-center py-5 reveal-fade-up"
      style={{ minHeight: 'calc(100vh - 140px)', backgroundColor: 'var(--bg-canvas)' }}
    >
      <div className="container py-5" style={{ maxWidth: '520px' }}>
        <div
          className="fw-bold mb-2 text-muted"
          style={{
            fontSize: '5rem',
            lineHeight: 1,
            letterSpacing: '-0.06em',
          }}
        >
          404
        </div>

        <h1 className="h3 fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Page not found
        </h1>

        <p className="text-secondary mb-4" style={{ lineHeight: 1.7 }}>
          The page or package you are looking for has been moved or does not exist. Return to the home page or browse the package catalog.
        </p>

        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link to="/" className="btn btn-primary btn-tactile">
            Return home
          </Link>
          <Link to="/packages" className="btn btn-outline-secondary btn-tactile">
            Browse packages
          </Link>
        </div>
      </div>
    </div>
  );
}
