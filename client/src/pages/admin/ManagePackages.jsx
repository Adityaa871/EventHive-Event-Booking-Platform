import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getPackages, deletePackage } from '../../services/packageService';

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError('');
      // Pass no isActive filter so admin sees all packages (active + inactive)
      const data = await getPackages({});
      setPackages(data?.packages || data?.data || data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load packages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id, title) => {
    if (
      !window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)
    )
      return;

    try {
      setDeletingId(id);
      await deletePackage(id);
      setPackages((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete package.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas)' }}>
      <AdminSidebar />

      <main className="flex-grow-1 p-4 p-lg-5">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <h1 className="h4 fw-bold tracking-tight mb-1">Manage Packages</h1>
            <p className="text-secondary small mb-0">
              Create, edit, and configure your event catalog offerings.
            </p>
          </div>
          <Link
            to="/admin/packages/new"
            className="btn btn-primary btn-tactile"
          >
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            New Package
          </Link>
        </div>

        {/* Table / Content */}
        {loading ? (
          <div className="p-5 text-center">
            <Loader />
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : packages.length === 0 ? (
          <div
            className="p-5 text-center text-muted card-tactile"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <i className="bi bi-box-seam fs-2 d-block mb-3 text-muted" aria-hidden="true" />
            <h2 className="h5 fw-bold text-dark mb-2">No packages in catalog</h2>
            <p className="text-secondary small mb-4">Start creating your tailored event packages for prospective clients.</p>
            <Link
              to="/admin/packages/new"
              className="btn btn-primary btn-tactile"
            >
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              Create First Package
            </Link>
          </div>
        ) : (
          <div
            className="card-tactile overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th className="px-4">Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Capacity</th>
                    <th>Featured</th>
                    <th>Status</th>
                    <th className="text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg._id}>
                      <td className="px-4">
                        <div className="fw-semibold text-dark">{pkg.title}</div>
                        <div className="text-muted small text-truncate" style={{ maxWidth: '280px' }}>
                          {pkg.shortDescription}
                        </div>
                      </td>
                      <td className="text-capitalize small">{pkg.category}</td>
                      <td className="small fw-semibold text-dark">
                        {pkg.price != null
                          ? `₹${pkg.price.toLocaleString('en-IN')}`
                          : '—'}
                      </td>
                      <td className="small text-secondary">{pkg.capacity ? `${pkg.capacity} guests` : '—'}</td>
                      <td>
                        {pkg.isFeatured ? (
                          <span
                            className="badge badge-neutral"
                            style={{
                              color: 'var(--brand-primary)',
                              borderColor: 'var(--border-medium)',
                            }}
                          >
                            Featured
                          </span>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                      <td>
                        {pkg.isActive !== false ? (
                          <span className="badge status-confirmed">Active</span>
                        ) : (
                          <span className="badge badge-neutral">Inactive</span>
                        )}
                      </td>
                      <td className="text-end px-4">
                        <div className="d-inline-flex gap-2">
                          <Link
                            to={`/admin/packages/${pkg._id}/edit`}
                            className="btn btn-sm btn-outline-secondary btn-tactile"
                          >
                            <i className="bi bi-pencil me-1" aria-hidden="true" />
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger btn-tactile"
                            disabled={deletingId === pkg._id}
                            onClick={() => handleDelete(pkg._id, pkg.title)}
                          >
                            {deletingId === pkg._id ? '…' : (
                              <>
                                <i className="bi bi-trash3 me-1" aria-hidden="true" />
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="p-3 px-4 border-top small text-muted text-end"
              style={{ backgroundColor: 'var(--bg-surface)' }}
            >
              {packages.length} package{packages.length !== 1 ? 's' : ''} listed
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManagePackages;
