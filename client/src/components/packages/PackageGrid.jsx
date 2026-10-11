import PackageCard from './PackageCard';

/**
 * Responsive grid layout for package cards.
 * @param {Array} packages - Array of package objects
 */
const PackageGrid = ({ packages }) => {
  if (!packages || packages.length === 0) {
    return (
      <div className="text-center py-5">
        <div style={{ fontSize: '4rem' }}>📦</div>
        <h4 className="text-muted mt-3">No packages found</h4>
        <p className="text-muted">Try adjusting your filters or search terms.</p>
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

