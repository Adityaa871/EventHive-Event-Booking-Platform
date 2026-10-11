import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div
      className="d-flex align-items-center justify-content-center text-center"
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}
    >
      <div className="container py-5">
        <div className="mb-4">
          <span
            className="fw-black text-primary"
            style={{ fontSize: 'clamp(6rem, 20vw, 12rem)', lineHeight: 1, display: 'block' }}
          >
            404
          </span>
          <div
            className="rounded-pill bg-primary mx-auto mb-4"
            style={{ height: '4px', width: '80px' }}
          ></div>
        </div>

        <h1 className="display-6 fw-bold mb-3 text-dark">Oops! Page Not Found</h1>
        <p className="text-muted fs-5 mb-5 mx-auto" style={{ maxWidth: '480px' }}>
          The page you're looking for doesn't exist or has been moved. Let's get you back to
          planning your perfect event.
        </p>

        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link to="/" className="btn btn-primary btn-lg px-5 rounded-pill fw-semibold">
            <i className="bi bi-house-fill me-2"></i>
            Go Home
          </Link>
          <Link to="/packages" className="btn btn-outline-primary btn-lg px-5 rounded-pill">
            <i className="bi bi-grid me-2"></i>
            Browse Packages
          </Link>
        </div>

        <div className="mt-5">
          <i
            className="bi bi-balloon-heart text-primary opacity-25"
            style={{ fontSize: '5rem' }}
          ></i>
        </div>
      </div>
    </div>
  );
}
