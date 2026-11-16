import { useState, useEffect } from 'react';
import { getPackages } from '../services/packageService';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import PackageFilters from '../components/packages/PackageFilters';
import PackageGrid from '../components/packages/PackageGrid';
import Pagination from '../components/common/Pagination';

const ITEMS_PER_PAGE = 9;
const SEARCH_DEBOUNCE_MS = 300;

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch packages
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
      ignore = true;
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
  const hasFilters = Boolean(debouncedSearch || category);

  return (
    <div className="reveal-fade-up">
      {/* ── Page Header ── */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          paddingTop: '48px',
          paddingBottom: '48px',
        }}
      >
        <div className="container">
          <div className="d-inline-flex align-items-center gap-2 mb-2 text-muted small text-uppercase fw-semibold" style={{ letterSpacing: '0.06em' }}>
            <span>Catalog</span>
            <span>•</span>
            <span>All packages</span>
          </div>
          <h1 className="h2 fw-bold mb-2">Event Packages</h1>
          <p className="text-secondary mb-0" style={{ maxWidth: '560px' }}>
            Transparent package inclusions designed for weddings, birthdays, corporate seminars, and special galas.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-5" style={{ minHeight: '600px' }}>
        <div className="container">
          <PackageFilters
            search={search}
            category={category}
            onSearchChange={setSearch}
            onCategoryChange={handleCategoryChange}
          />

          {/* Results Summary Bar */}
          {!loading && !error && (
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
              <div className="small text-muted">
                {packages.length === 0 ? (
                  'No packages found'
                ) : (
                  <span>
                    Showing <strong className="text-dark">{packages.length}</strong> package{packages.length !== 1 ? 's' : ''}
                    {debouncedSearch && <span> matching <em>"{debouncedSearch}"</em></span>}
                    {category && <span> in <strong className="text-dark text-capitalize">{category}</strong></span>}
                  </span>
                )}
              </div>
              {hasFilters && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm btn-tactile"
                  onClick={handleClearFilters}
                  style={{ fontSize: '12px', padding: '4px 10px' }}
                >
                  <i className="bi bi-x me-1" aria-hidden="true" />
                  Reset filters
                </button>
              )}
            </div>
          )}

          {/* Dynamic Content States */}
          {loading ? (
            <div className="py-5 text-center">
              <Loader />
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <PackageGrid packages={packages} />
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-5 pt-3 d-flex justify-content-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
