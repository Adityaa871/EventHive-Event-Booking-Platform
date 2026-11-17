import { useState, useEffect } from 'react';
import { getPackages } from '../services/packageService';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import PackageFilters from '../components/packages/PackageFilters';
import PackageGrid from '../components/packages/PackageGrid';

const ITEMS_PER_PAGE = 9;
const SEARCH_DEBOUNCE_MS = 300;

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');             // raw input value
  const [debouncedSearch, setDebouncedSearch] = useState(''); // value sent to API
  const [category, setCategory] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  // Debounce the search input; resetting to page 1 happens in the same batch
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  // Single source of truth for fetching
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {
          limit: ITEMS_PER_PAGE,
          page,
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(category && { category }),
        };
        const data = await getPackages(params);
        if (ignore) return;

        const list = Array.isArray(data) ? data : data?.packages ?? [];
        setPackages(list);
        setTotalPages(
          data?.totalPages ||
            Math.ceil((data?.total || 0) / ITEMS_PER_PAGE) ||
            1
        );
      } catch (err) {
        if (ignore) return;
        setError(err?.response?.data?.message || err?.message || 'Failed to load packages.');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true; // discard responses from superseded requests
    };
  }, [page, debouncedSearch, category, reloadKey]);

  const handleCategoryChange = (val) => {
    setCategory(val);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setCategory('');
    setPage(1);
  };

  const handleRetry = () => setReloadKey((k) => k + 1);

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

  const hasFilters = Boolean(debouncedSearch || category);

  return (
    <>
      {/* Page Header */}
      <section
        className="py-5 bg-white text-dark text-center border-bottom d-flex align-items-center"
        style={{ minHeight: '200px' }}
      >
        <div className="container">
          <span className="badge rounded-pill bg-light text-secondary border fw-medium text-uppercase small px-3 py-2 mb-3">
            All Packages
          </span>
          <h1 className="h2 fw-bold tracking-tight mb-2">Event Packages</h1>
          <p
            className="text-muted fs-6 mx-auto mb-0"
            style={{ maxWidth: '520px' }}
          >
            Discover the perfect package for your celebration
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-4 py-md-5 bg-light">
        <div className="container">
          <div className="mb-4">
            <PackageFilters
              search={search}
              category={category}
              onSearchChange={setSearch}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Results summary */}
          {!loading && !error && (
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
              <p className="text-muted mb-0 small">
                {packages.length === 0
                  ? 'No packages found'
                  : `Showing ${packages.length} package${packages.length !== 1 ? 's' : ''}`}
                {debouncedSearch && (
                  <span>
                    {' '}for <strong className="text-dark">"{debouncedSearch}"</strong>
                  </span>
                )}
                {category && (
                  <span>
                    {' '}in <strong className="text-dark">{category}</strong>
                  </span>
                )}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary rounded-pill d-inline-flex align-items-center px-3"
                  onClick={handleClearFilters}
                >
                  <i className="bi bi-x me-1"></i>
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Content states */}
          {loading ? (
            <div className="py-5 d-flex justify-content-center">
              <Loader />
            </div>
          ) : error ? (
            <ErrorMessage message={error} onRetry={handleRetry} />
          ) : packages.length === 0 ? (
            <div className="text-center py-5 my-2">
              <i className="bi bi-search fs-2 text-muted d-block mb-2 opacity-50"></i>
              <h2 className="h6 text-dark fw-semibold mb-1">No packages found</h2>
              <p className="text-muted small mb-0">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <PackageGrid packages={packages} />
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <nav className="mt-5" aria-label="Package pagination">
              <ul className="pagination pagination-sm justify-content-center align-items-center flex-wrap gap-1 mb-2">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button
                    type="button"
                    className="page-link rounded-pill px-3 d-inline-flex align-items-center"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    aria-label="Previous page"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>

                {getPaginationRange().map((p, i) =>
                  p === '...' ? (
                    <li key={`ellipsis-${i}`} className="page-item disabled">
                      <span className="page-link border-0 bg-transparent text-muted px-2">
                        …
                      </span>
                    </li>
                  ) : (
                    <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                      <button
                        type="button"
                        className="page-link rounded-pill px-3"
                        onClick={() => handlePageChange(p)}
                        aria-current={p === page ? 'page' : undefined}
                      >
                        {p}
                      </button>
                    </li>
                  )
                )}

                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button
                    type="button"
                    className="page-link rounded-pill px-3 d-inline-flex align-items-center"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    aria-label="Next page"
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>

              <p className="text-center text-muted small mb-0">
                Page {page} of {totalPages}
              </p>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}   