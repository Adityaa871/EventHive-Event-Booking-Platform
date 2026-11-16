import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPackage } from '../services/packageService';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

export default function PackageDetails() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  const fetchPackage = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPackage(id);
      setPkg(data);
      setActiveImage(0);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load package details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5" style={{ maxWidth: '600px' }}>
        <ErrorMessage message={error} />
        <div className="text-center mt-3">
          <Link to="/packages" className="btn btn-outline-primary btn-sm btn-tactile">
            <i className="bi bi-arrow-left me-2" aria-hidden="true" />
            Back to packages
          </Link>
        </div>
      </div>
    );
  }

  if (!pkg) return null;

  const images = pkg.images?.filter(Boolean) || [];
  const categoryLabel = pkg.category
    ? pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1)
    : 'Package';

  return (
    <div className="reveal-fade-up">
      {/* ── Breadcrumb Bar ── */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '14px 0',
        }}
      >
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/packages">Packages</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {pkg.title || pkg.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Main Detail Content ── */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            {/* Left: Gallery */}
            <div className="col-lg-6">
              {images.length > 0 ? (
                <>
                  <div
                    className="position-relative overflow-hidden mb-3"
                    style={{
                      height: '420px',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <img
                      src={images[activeImage]}
                      alt={`${pkg.title || pkg.name} preview`}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />

                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="btn btn-tactile position-absolute top-50 start-0 translate-middle-y ms-3"
                          style={{
                            width: '36px',
                            height: '36px',
                            padding: 0,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                          }}
                          onClick={() =>
                            setActiveImage((prev) => (prev - 1 + images.length) % images.length)
                          }
                          aria-label="Previous photo"
                        >
                          <i className="bi bi-chevron-left" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-tactile position-absolute top-50 end-0 translate-middle-y me-3"
                          style={{
                            width: '36px',
                            height: '36px',
                            padding: 0,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                          }}
                          onClick={() =>
                            setActiveImage((prev) => (prev + 1) % images.length)
                          }
                          aria-label="Next photo"
                        >
                          <i className="bi bi-chevron-right" aria-hidden="true" />
                        </button>
                        <div className="position-absolute bottom-0 end-0 m-3">
                          <span
                            className="badge"
                            style={{
                              backgroundColor: 'rgba(24, 24, 27, 0.85)',
                              color: '#ffffff',
                              fontSize: '11px',
                              letterSpacing: '0.04em',
                            }}
                          >
                            {activeImage + 1} / {images.length}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  {images.length > 1 && (
                    <div className="d-flex gap-2 overflow-auto pb-1">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImage(idx)}
                          className="p-0 border-0 flex-shrink-0"
                          style={{
                            width: '74px',
                            height: '56px',
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            outline: activeImage === idx ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                            opacity: activeImage === idx ? 1 : 0.65,
                            transition: 'all 0.15s ease',
                          }}
                          aria-label={`View photo ${idx + 1}`}
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-100 h-100"
                            style={{ objectFit: 'cover' }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="d-flex flex-column align-items-center justify-content-center text-muted"
                  style={{
                    height: '420px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px dashed var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <i className="bi bi-image fs-1 mb-2 text-secondary" aria-hidden="true" />
                  <p className="small mb-0">No photos uploaded for this package</p>
                </div>
              )}
            </div>

            {/* Right: Package Info & Action */}
            <div className="col-lg-6">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge badge-neutral text-uppercase" style={{ letterSpacing: '0.04em' }}>
                  {categoryLabel}
                </span>
                {pkg.isFeatured && (
                  <span className="badge" style={{ backgroundColor: 'var(--brand-primary)', color: '#ffffff' }}>
                    Featured
                  </span>
                )}
              </div>

              <h1 className="h2 fw-bold mb-3" style={{ letterSpacing: '-0.03em' }}>
                {pkg.title || pkg.name}
              </h1>

              {/* Price Block */}
              <div className="mb-4 pb-3 border-bottom">
                <div className="text-muted small text-uppercase fw-semibold" style={{ letterSpacing: '0.04em' }}>
                  Base package price
                </div>
                <div className="d-flex align-items-baseline gap-2">
                  <span className="display-6 fw-bold text-dark" style={{ letterSpacing: '-0.03em' }}>
                    ₹{Number(pkg.price || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-muted small">inclusive of initial consultation & planning</span>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="row g-3 mb-4">
                {pkg.capacity && (
                  <div className="col-sm-6">
                    <div
                      className="p-3 card-tactile"
                      style={{ backgroundColor: 'var(--bg-surface)' }}
                    >
                      <div className="text-muted small">Guest capacity</div>
                      <div className="fw-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                        Up to {pkg.capacity} attendees
                      </div>
                    </div>
                  </div>
                )}
                {pkg.duration && (
                  <div className="col-sm-6">
                    <div
                      className="p-3 card-tactile"
                      style={{ backgroundColor: 'var(--bg-surface)' }}
                    >
                      <div className="text-muted small">Event duration</div>
                      <div className="fw-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                        {pkg.duration}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {pkg.description && (
                <div className="mb-4">
                  <h6 className="fw-bold text-uppercase text-muted small mb-2" style={{ letterSpacing: '0.05em' }}>
                    Overview
                  </h6>
                  <p className="text-secondary" style={{ lineHeight: 1.7 }}>
                    {pkg.description}
                  </p>
                </div>
              )}

              {/* Inclusions */}
              {pkg.inclusions?.length > 0 && (
                <div className="mb-4 pb-3 border-bottom">
                  <h6 className="fw-bold text-uppercase text-muted small mb-3" style={{ letterSpacing: '0.05em' }}>
                    What is included
                  </h6>
                  <div className="row g-2">
                    {pkg.inclusions.map((item, i) => (
                      <div key={i} className="col-sm-6">
                        <div className="d-flex align-items-start gap-2 small text-secondary">
                          <i className="bi bi-check2 text-dark fw-bold" aria-hidden="true" />
                          <span>{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex gap-3 flex-wrap pt-2">
                <Link
                  to="/book"
                  state={{ packageId: pkg._id }}
                  className="btn btn-primary btn-tactile btn-lg flex-grow-1"
                >
                  Book this package
                  <i className="bi bi-arrow-right ms-2 icon-nudge" aria-hidden="true" />
                </Link>
                <Link
                  to="/contact"
                  className="btn btn-outline-secondary btn-tactile btn-lg"
                >
                  Ask a question
                </Link>
              </div>

              <div className="d-flex align-items-center gap-2 mt-3 text-muted small">
                <i className="bi bi-shield-check text-dark" aria-hidden="true" />
                <span>Custom date blocking • Zero obligation estimate</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
