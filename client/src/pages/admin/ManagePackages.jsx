import React, { useEffect, useState } from 'react';
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
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <AdminSidebar />

      <main className="flex-grow-1 p-4">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <h4 className="fw-bold mb-0" style={{ color: '#0d1b2a' }}>
              📦 Manage Packages
            </h4>
            <p className="text-muted small mb-0">
              Create, edit, and manage all event packages.
            </p>
          </div>
          <Link
            to="/admin/packages/new"
            className="btn fw-semibold"
            style={{ background: '#f5a623', color: '#0d1b2a', border: 'none' }}
          >
            + Add New Package
          </Link>
        </div>

        {/* Table */}
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : packages.length === 0 ? (
          <div className="text-center text-muted py-5">
            <p className="mb-3">No packages found.</p>
            <Link
              to="/admin/packages/new"
              className="btn"
              style={{ background: '#f5a623', color: '#0d1b2a', border: 'none' }}
            >
              Create Your First Package
            </Link>
          </div>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead style={{ background: '#0d1b2a', color: '#f5a623' }}>
                  <tr>
                    <th className="px-3">Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Capacity</th>
                    <th>Featured</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg._id}>
                      <td className="px-3 fw-semibold">{pkg.title}</td>
                      <td className="text-capitalize small">{pkg.category}</td>
                      <td className="small">
                        {pkg.price != null
                          ? `₹${pkg.price.toLocaleString('en-IN')}`
                          : '—'}
                      </td>
                      <td className="small">{pkg.capacity ?? '—'}</td>
                      <td>
                        {pkg.isFeatured ? (
                          <span className="badge" style={{ background: '#f5a623', color: '#0d1b2a' }}>
                            ⭐ Featured
                          </span>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                      <td>
                        {pkg.isActive !== false ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-secondary">Inactive</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/admin/packages/${pkg._id}/edit`}
                            className="btn btn-sm"
                            style={{
                              background: '#e8f0fe',
                              color: '#0d1b2a',
                              fontSize: '0.78rem',
                            }}
                          >
                            ✏️ Edit
                          </Link>
                          <button
                            className="btn btn-sm btn-danger"
                            style={{ fontSize: '0.78rem' }}
                            disabled={deletingId === pkg._id}
                            onClick={() => handleDelete(pkg._id, pkg.title)}
                          >
                            {deletingId === pkg._id ? '…' : '🗑 Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="card-footer border-0 small text-muted text-end"
              style={{ background: '#f8f9fa' }}
            >
              {packages.length} package{packages.length !== 1 ? 's' : ''} total
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManagePackages;
