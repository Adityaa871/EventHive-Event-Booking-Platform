import PackageCard from './PackageCard';

/**
 * Responsive grid layout for package cards.
 * @param {Array} packages - Array of package objects
 */
const PackageGrid = ({ packages }) => {
  if (!packages || packages.length === 0) {
    return (
      <div
        className="text-center py-5 my-4"
        style={{
          border: '1px dashed var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <div
          className="d-inline-flex align-items-center justify-content-center mb-3 text-muted"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface-subtle)',
          }}
        >
          <i className="bi bi-search" style={{ fontSize: '1.25rem' }} aria-hidden="true" />
        </div>
        <h4 className="fw-bold mb-2" style={{ fontSize: '1.15rem' }}>No matching packages</h4>
        <p className="text-muted small mb-0" style={{ maxWidth: '360px', margin: '0 auto' }}>
          Try clearing your search query or selecting a different event category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
      {packages.map((pkg) => (
        <div className="col" key={pkg._id}>
          <PackageCard pkg={pkg} />
        </div>
      ))}
    </div>
  );
};

export default PackageGrid;
