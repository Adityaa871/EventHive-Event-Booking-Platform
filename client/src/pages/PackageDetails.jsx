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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const categoryColors = {
    birthday: 'primary',
    wedding: 'danger',
    corporate: 'dark',
    anniversary: 'success',
    other: 'secondary',
  };

  const badgeColor = pkg ? (categoryColors[pkg.category?.toLowerCase()] || 'primary') : 'primary';

  if (loading) {
    return (
      <div className="container py-5">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <ErrorMessage message={error} onRetry={fetchPackage} />
        <div className="text-center mt-3">
          <Link to="/packages" className="btn btn-outline-primary rounded-pill">
            <i className="bi bi-arrow-left me-2"></i>
            Back to Packages
          </Link>
        </div>
      </div>
    );
  }

  if (!pkg) return null;

  const images = pkg.images?.filter(Boolean) || [];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-light border-bottom py-3">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/packages" className="text-decoration-none">Packages</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {pkg.title || pkg.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            {/* ── Image Gallery ── */}
            <div className="col-lg-6">
              {images.length > 0 ? (
                <>
                  {/* Main Image */}
                  <div
                    className="rounded-4 overflow-hidden shadow mb-3 position-relative"
                    style={{ height: '420px' }}
                  >
                    <img
                      src={images[activeImage]}
                      alt={`${pkg.title || pkg.name} — image ${activeImage + 1}`}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          className="btn btn-light btn-sm position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle shadow"
                          style={{ width: '40px', height: '40px' }}
                          onClick={() => setActiveImage((prev) => (prev - 1 + images.length) % images.length)}
                          aria-label="Previous image"
                        >
                          <i className="bi bi-chevron-left"></i>
                        </button>
                        <button
                          className="btn btn-light btn-sm position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle shadow"
                          style={{ width: '40px', height: '40px' }}
                          onClick={() => setActiveImage((prev) => (prev + 1) % images.length)}
                          aria-label="Next image"
                        >
                          <i className="bi bi-chevron-right"></i>
                        </button>
                        <div className="position-absolute bottom-0 end-0 m-3">
                          <span className="badge bg-dark bg-opacity-60 px-2 py-1">
                            {activeImage + 1} / {images.length}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="d-flex gap-2 overflow-auto pb-1">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImage(idx)}
                          className={`p-0 border-0 rounded-3 overflow-hidden flex-shrink-0 ${
                            activeImage === idx ? 'ring-active' : 'opacity-60'
                          }`}
                          style={{
                            width: '80px',
                            height: '60px',
                            outline: activeImage === idx ? '3px solid #0d6efd' : 'none',
                            outlineOffset: '2px',
                            transition: 'opacity 0.2s',
                          }}
                          aria-label={`View image ${idx + 1}`}
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
                /* Fallback */
                <div
                  className="rounded-4 d-flex align-items-center justify-content-center shadow"
                  style={{
                    height: '420px',
                    background: 'linear-gradient(135deg, #e8f4fd 0%, #f3e8ff 100%)',
                  }}
                >
                  <div className="text-center text-muted">
                    <i className="bi bi-image fs-1 d-block mb-3 opacity-40"></i>
                    <p className="small">No images available</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Package Info ── */}
            <div className="col-lg-6">
              {/* Category */}
              {pkg.category && (
                <span className={`badge bg-${badgeColor} text-capitalize mb-3 px-3 py-2`}>
                  <i className="bi bi-tag me-1"></i>
                  {pkg.category}
                </span>
              )}

              <h1 className="display-6 fw-bold mb-3">{pkg.title || pkg.name}</h1>

              {/* Price */}
              {pkg.price && (
                <div className="mb-4">
                  <span className="display-6 fw-black text-primary">
                    ₹{pkg.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-muted ms-2">onwards</span>
                </div>
              )}

              {/* Quick Stats */}
              <div className="row g-3 mb-4">
                {pkg.capacity && (
                  <div className="col-auto">
                    <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 bg-light border">
                      <i className="bi bi-people-fill text-primary"></i>
                      <div>
                        <div className="small text-muted">Capacity</div>
                        <div className="fw-semibold small">{pkg.capacity} guests</div>
                      </div>
                    </div>
                  </div>
                )}
                {pkg.duration && (
                  <div className="col-auto">
                    <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 bg-light border">
                      <i className="bi bi-clock-fill text-success"></i>
                      <div>
                        <div className="small text-muted">Duration</div>
                        <div className="fw-semibold small">{pkg.duration}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {pkg.description && (
                <div className="mb-4">
                  <h5 className="fw-bold mb-2">About This Package</h5>
                  <p className="text-muted lh-relaxed">{pkg.description}</p>
                </div>
              )}

              {/* Inclusions */}
              {pkg.inclusions?.length > 0 && (
                <div className="mb-4">
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    What's Included
                  </h5>
                  <div className="d-flex flex-wrap gap-2">
                    {pkg.inclusions.map((item, i) => (
                      <span key={i} className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
                        <i className="bi bi-check2 me-1"></i>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="d-flex gap-3 flex-wrap mt-4 pt-2 border-top">
                <Link
                  to="/book"
                  state={{ packageId: pkg._id }}
                  className="btn btn-primary btn-lg px-5 rounded-pill fw-bold flex-grow-1"
                >
                  <i className="bi bi-calendar-check me-2"></i>
                  Book This Package
                </Link>
                <Link
                  to="/contact"
                  className="btn btn-outline-secondary btn-lg rounded-pill"
                >
                  <i className="bi bi-chat me-1"></i>
                  Enquire
                </Link>
              </div>

              <p className="text-muted small mt-3">
                <i className="bi bi-shield-check text-success me-1"></i>
                Free consultation • No hidden charges • 100% satisfaction
              </p>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-5 pt-3 border-top">
            <Link to="/packages" className="btn btn-outline-secondary rounded-pill">
              <i className="bi bi-arrow-left me-2"></i>
              Back to All Packages
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
