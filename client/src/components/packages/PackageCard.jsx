import { Link } from 'react-router-dom';

/**
 * Card displaying a single event package summary with tactile hover and clean editorial typography.
 * @param {Object} pkg - Package data from API
 */
const PackageCard = ({ pkg }) => {
  const fallbackImg = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600';
  const img = pkg.images?.[0] || fallbackImg;
  const categoryLabel = pkg.category
    ? pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1)
    : 'Package';

  return (
    <div className="card card-tactile card-interactive h-100 d-flex flex-column overflow-hidden">
      {/* Package Image & Badges */}
      <div style={{ position: 'relative', height: '210px', backgroundColor: 'var(--bg-surface-subtle)', overflow: 'hidden' }}>
        <img
          src={img}
          alt={pkg.title || 'Event package'}
          className="w-100 h-100"
          style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
          onError={(e) => {
            e.target.src = fallbackImg;
          }}
        />
        {/* Subtle Category & Featured Tags */}
        <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
          <span
            className="badge badge-neutral"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              backdropFilter: 'none',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {categoryLabel}
          </span>
          {pkg.isFeatured && (
            <span
              className="badge"
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: '#ffffff',
                fontSize: '11px',
                letterSpacing: '0.02em',
              }}
            >
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Package Body */}
      <div className="card-body d-flex flex-column p-4">
        <h4
          className="card-title fw-bold mb-2"
          style={{
            fontSize: '1.15rem',
            letterSpacing: '-0.025em',
            color: 'var(--text-primary)',
            lineHeight: 1.3,
          }}
        >
          {pkg.title}
        </h4>

        <p
          className="card-text text-muted small flex-grow-1 mb-3"
          style={{ lineHeight: 1.6, minHeight: '40px' }}
        >
          {pkg.shortDescription || pkg.description?.slice(0, 110) || 'Custom package built to deliver a seamless event.'}
          {!pkg.shortDescription && pkg.description?.length > 110 ? '…' : ''}
        </p>

        {/* Specifications */}
        <div
          className="d-flex align-items-center gap-3 py-2 mb-3 text-secondary small"
          style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', fontSize: '12px' }}
        >
          {pkg.capacity && (
            <span className="d-flex align-items-center gap-1">
              <i className="bi bi-people" aria-hidden="true" />
              {pkg.capacity} guests
            </span>
          )}
          {pkg.duration && (
            <span className="d-flex align-items-center gap-1">
              <i className="bi bi-clock" aria-hidden="true" />
              {pkg.duration}
            </span>
          )}
        </div>

        {/* Price & CTA */}
        <div className="d-flex justify-content-between align-items-center mt-auto pt-1">
          <div>
            <div className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              From
            </div>
            <div className="fw-bold" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              ₹{Number(pkg.price || 0).toLocaleString('en-IN')}
            </div>
          </div>

          <Link
            to={`/packages/${pkg._id}`}
            className="btn btn-outline-primary btn-tactile btn-sm"
            style={{ fontSize: '13px', padding: '6px 14px' }}
          >
            Details
            <i className="bi bi-arrow-right ms-2 icon-nudge" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
