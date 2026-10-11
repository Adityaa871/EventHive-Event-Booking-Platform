import { useState, useEffect, useCallback, useRef } from 'react';
import { getPackages } from '../services/packageService';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import PackageFilters from '../components/packages/PackageFilters';
import PackageGrid from '../components/packages/PackageGrid';

const ITEMS_PER_PAGE = 9;

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // Debounce ref
  const debounceRef = useRef(null);

  const fetchPackages = useCallback(async (searchVal, categoryVal, pageVal) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        limit: ITEMS_PER_PAGE,
        page: pageVal,
        ...(searchVal && { search: searchVal }),
        ...(categoryVal && { category: categoryVal }),
      };
      const data = await getPackages(params);
      setPackages(data.packages || data || []);
      setTotalPages(data.totalPages || Math.ceil((data.total || 0) / ITEMS_PER_PAGE) || 1);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load packages.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on page/category change immediately
  useEffect(() => {
    fetchPackages(search, category, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category]);

  // Debounced search
  const handleSearchChange = (val) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchPackages(val, category, 1);
    }, 300);
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => fetchPackages(search, category, page);

  // Build pagination range
  const getPaginationRange = () => {
    const range = [];
    const delta = 2;
    const left = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);

    if (left > 1) {
      range.push(1);
      if (left > 2) range.push('...');
    }
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages) {
      if (right < totalPages - 1) range.push('...');
      range.push(totalPages);
    }
    return range;
  };

  return (
    <>
      {/* Page Header */}
      <section
        className="py-5 text-white text-center"
        style={{
          background: 'linear-gradient(135deg, #0d1b6e 0%, #6f42c1 100%)',
          minHeight: '260px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container py-3">
          <span className="badge bg-white bg-opacity-15 text-white fw-normal mb-3 px-3 py-2">
            All Packages
          </span>
          <h1 className="display-5 fw-bold mb-2">Event Packages</h1>
          <p className="lead opacity-75 mb-0">
            Discover the perfect package for your celebration
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-5 bg-light">
        <div className="container">
          {/* Filters */}
          <PackageFilters
            search={search}
            category={category}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
          />

          {/* Results count */}
          {!loading && !error && (
            <div className="d-flex align-items-center justify-content-between mb-4">
              <p className="text-muted mb-0 small">
                {packages.length === 0
                  ? 'No packages found'
                  : `Showing ${packages.length} package${packages.length !== 1 ? 's' : ''}`}
                {search && (
                  <span>
                    {' '}
                    for <strong>"{search}"</strong>
                  </span>
                )}
                {category && (
                  <span>
                    {' '}
                    in <strong>{category}</strong>
                  </span>
                )}
              </p>
              {(search || category) && (
                <button
                  className="btn btn-sm btn-outline-secondary rounded-pill"
                  onClick={() => {
                    setSearch('');
                    setCategory('');
                    setPage(1);
                    fetchPackages('', '', 1);
                  }}
                >
                  <i className="bi bi-x me-1"></i>
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Content States */}
          {loading ? (
            <div className="py-5">
              <Loader />
            </div>
          ) : error ? (
            <ErrorMessage message={error} onRetry={handleRetry} />
          ) : packages.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-search fs-1 text-muted d-block mb-3 opacity-40"></i>
              <h5 className="text-muted fw-semibold">No packages found</h5>
              <p className="text-muted small">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <PackageGrid packages={packages} />
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <nav className="mt-5" aria-label="Package pagination">
              <ul className="pagination justify-content-center flex-wrap gap-1">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link rounded-pill px-3"
                    onClick={() => handlePageChange(page - 1)}
                    aria-label="Previous"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>

                {getPaginationRange().map((p, i) => (
                  <li
                    key={i}
                    className={`page-item ${p === page ? 'active' : ''} ${p === '...' ? 'disabled' : ''}`}
                  >
                    <button
                      className="page-link rounded-pill px-3"
                      onClick={() => typeof p === 'number' && handlePageChange(p)}
                      disabled={p === '...'}
                    >
                      {p}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link rounded-pill px-3"
                    onClick={() => handlePageChange(page + 1)}
                    aria-label="Next"
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>

              <p className="text-center text-muted small mt-2">
                Page {page} of {totalPages}
              </p>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
