const CATEGORIES = ['', 'birthday', 'wedding', 'corporate', 'anniversary', 'other'];

const CATEGORY_LABELS = {
  '': 'All Packages',
  birthday: 'Birthday',
  wedding: 'Wedding',
  corporate: 'Corporate',
  anniversary: 'Anniversary',
  other: 'Other',
};

/**
 * Clean, flat category filter buttons + search bar for packages listing.
 */
const PackageFilters = ({ selectedCategory, onCategoryChange, search, onSearchChange }) => {
  return (
    <div className="mb-4">
      {/* Search Input */}
      <div className="input-group mb-3" style={{ maxWidth: '420px' }}>
        <span
          className="input-group-text border-end-0"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-muted)',
            paddingLeft: '14px',
          }}
        >
          <i className="bi bi-search" aria-hidden="true" />
        </span>
        <input
          type="text"
          className="form-control border-start-0"
          placeholder="Search by package name or description..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search packages"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
            fontSize: '14px',
          }}
        />
        {search && (
          <button
            className="btn btn-outline-secondary border-start-0"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
            type="button"
            style={{
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Category Pills/Tabs */}
      <div className="d-flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              className="btn btn-tactile"
              style={{
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isActive ? 'var(--brand-primary)' : 'var(--bg-surface)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                borderColor: isActive ? 'var(--brand-primary)' : 'var(--border-subtle)',
              }}
              onClick={() => onCategoryChange(cat)}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PackageFilters;
