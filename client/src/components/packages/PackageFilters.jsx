const CATEGORIES = ['', 'birthday', 'wedding', 'corporate', 'anniversary', 'other'];
const CATEGORY_LABELS = {
  '': 'All Categories',
  birthday: '🎂 Birthday',
  wedding: '💍 Wedding',
  corporate: '🏢 Corporate',
  anniversary: '💛 Anniversary',
  other: '🎉 Other',
};

/**
 * Category filter buttons + search bar for packages listing.
 */
const PackageFilters = ({ selectedCategory, onCategoryChange, search, onSearchChange }) => {
  return (
    <div className="mb-4">
      {/* Search */}
      <div className="input-group mb-3" style={{ maxWidth: '400px' }}>
        <span className="input-group-text bg-white border-end-0">
          <i className="bi bi-search text-muted"></i>
        </span>
        <input
          type="text"
          className="form-control border-start-0"
          placeholder="Search packages..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search packages"
        />
        {search && (
          <button className="btn btn-outline-secondary" onClick={() => onSearchChange('')} aria-label="Clear search">
            <i className="bi bi-x-lg"></i>
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="d-flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
            style={{ borderRadius: '20px' }}
            onClick={() => onCategoryChange(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PackageFilters;

