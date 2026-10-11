import { Link } from 'react-router-dom';

const CATEGORY_ICONS = {
  birthday: '🎂',
  wedding: '💍',
  corporate: '🏢',
  anniversary: '💛',
  other: '🎉',
};

const CATEGORY_COLORS = {
  birthday: '#ff6b6b',
  wedding: '#e91e63',
  corporate: '#1565c0',
  anniversary: '#f5a623',
  other: '#6c757d',
};

/**
 * Card displaying a single event package summary.
 * @param {Object} pkg - Package data from API
 */
const PackageCard = ({ pkg }) => {
  const fallbackImg = `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600`;
  const img = pkg.images?.[0] || fallbackImg;
  const icon = CATEGORY_ICONS[pkg.category] || '🎉';
  const catColor = CATEGORY_COLORS[pkg.category] || '#6c757d';

  return (
    <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img
          src={img}
          alt={pkg.title}
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
          onError={(e) => { e.target.src = fallbackImg; }}
        />
        {pkg.isFeatured && (
          <span className="badge position-absolute top-0 end-0 m-2" style={{ background: '#f5a623' }}>
            ⭐ Featured
          </span>
        )}
        <span
          className="badge position-absolute bottom-0 start-0 m-2"
          style={{ background: catColor, fontSize: '0.75rem' }}
        >
          {icon} {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1)}
        </span>
      </div>

      <div className="card-body d-flex flex-column p-4">
        <h5 className="card-title fw-bold mb-2" style={{ color: '#1a1a2e' }}>{pkg.title}</h5>
        <p className="card-text text-muted small flex-grow-1">{pkg.shortDescription}</p>

        <div className="d-flex flex-wrap gap-2 my-3 small text-muted">
          {pkg.capacity && (
            <span><i className="bi bi-people-fill me-1"></i>{pkg.capacity} guests</span>
          )}
          {pkg.duration && (
            <span><i className="bi bi-clock-fill me-1"></i>{pkg.duration}</span>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div>
            <span className="text-muted small">Starting from</span>
            <div className="fw-bold fs-5" style={{ color: '#f5a623' }}>
              ₹{pkg.price.toLocaleString('en-IN')}
            </div>
          </div>
          <Link
            to={`/packages/${pkg._id}`}
            className="btn btn-sm btn-outline-primary"
            style={{ borderRadius: '20px' }}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;

