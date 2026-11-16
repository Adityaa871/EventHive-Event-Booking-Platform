import { useEffect, useState, useCallback } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import { getBookings, updateBooking, deleteBooking } from '../../services/bookingService';

const STATUS_OPTIONS = ['new', 'contacted', 'confirmed', 'cancelled'];

const statusClass = (status) => {
  const map = {
    new: 'status-new',
    contacted: 'status-contacted',
    confirmed: 'status-confirmed',
    cancelled: 'status-cancelled',
  };
  return map[status] || 'badge-neutral';
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const BookingModal = ({ booking, onClose, onUpdate }) => {
  const [notes, setNotes] = useState(booking?.adminNotes || '');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  if (!booking) return null;

  const handleSaveNotes = async () => {
    try {
      setSaving(true);
      await onUpdate(booking._id, { adminNotes: notes });
      setSaveMsg('Saved successfully.');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch {
      setSaveMsg('Failed to save notes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(9, 9, 11, 0.6)', zIndex: 1050 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content card-tactile border shadow-sm">
          <div className="modal-header border-bottom px-4 py-3 bg-white">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-file-earmark-person text-secondary" aria-hidden="true" />
              <h5 className="modal-title fw-bold tracking-tight mb-0">Booking Details</h5>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>
          <div className="modal-body p-4 bg-white">
            <div className="row g-4">
              <div className="col-md-6">
                <span className="text-muted small text-uppercase fw-semibold" style={{ letterSpacing: '0.04em', fontSize: '11px' }}>
                  Client Name
                </span>
                <div className="fw-semibold text-dark mt-1">{booking.name}</div>
              </div>

              <div className="col-md-6">
                <span className="text-muted small text-uppercase fw-semibold" style={{ letterSpacing: '0.04em', fontSize: '11px' }}>
                  Email Address
                </span>
                <div className="text-dark mt-1">{booking.email}</div>
              </div>

              <div className="col-md-6">
                <span className="text-muted small text-uppercase fw-semibold" style={{ letterSpacing: '0.04em', fontSize: '11px' }}>
                  Phone
                </span>
                <div className="text-dark mt-1">{booking.phone || '—'}</div>
              </div>

              <div className="col-md-6">
                <span className="text-muted small text-uppercase fw-semibold" style={{ letterSpacing: '0.04em', fontSize: '11px' }}>
                  Event Type
                </span>
                <div className="text-capitalize text-dark mt-1">{booking.eventType || '—'}</div>
              </div>

              <div className="col-md-6">
                <span className="text-muted small text-uppercase fw-semibold" style={{ letterSpacing: '0.04em', fontSize: '11px' }}>
                  Scheduled Date
                </span>
                <div className="text-dark mt-1">
                  {booking.eventDate
                    ? new Date(booking.eventDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '—'}
                </div>
              </div>

              <div className="col-md-6">
                <span className="text-muted small text-uppercase fw-semibold" style={{ letterSpacing: '0.04em', fontSize: '11px' }}>
                  Package Reference
                </span>
                <div className="text-dark mt-1">{booking.package?.title || booking.packageName || 'Custom Inquiry'}</div>
              </div>

              <div className="col-md-6">
                <span className="text-muted small text-uppercase fw-semibold" style={{ letterSpacing: '0.04em', fontSize: '11px' }}>
                  Current Status
                </span>
                <div className="mt-1">
                  <span className={`badge ${statusClass(booking.status)} text-capitalize`}>
                    {booking.status}
                  </span>
                </div>
              </div>

              <div className="col-md-6">
                <span className="text-muted small text-uppercase fw-semibold" style={{ letterSpacing: '0.04em', fontSize: '11px' }}>
                  Submitted At
                </span>
                <div className="text-secondary small mt-1">
                  {booking.createdAt
                    ? new Date(booking.createdAt).toLocaleString('en-IN')
                    : '—'}
                </div>
              </div>

              {booking.message && (
                <div className="col-12">
                  <span className="text-muted small text-uppercase fw-semibold" style={{ letterSpacing: '0.04em', fontSize: '11px' }}>
                    Client Inquiry Message
                  </span>
                  <div
                    className="p-3 mt-1 rounded small"
                    style={{
                      backgroundColor: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.6,
                    }}
                  >
                    {booking.message}
                  </div>
                </div>
              )}

              <div className="col-12">
                <label className="form-label text-muted small text-uppercase fw-semibold mb-1" style={{ letterSpacing: '0.04em', fontSize: '11px' }}>
                  Internal Admin Notes
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record call logs, client preferences, or follow-up details…"
                />
                <div className="d-flex align-items-center gap-3 mt-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm btn-tactile"
                    onClick={handleSaveNotes}
                    disabled={saving}
                  >
                    {saving ? 'Saving…' : 'Save Notes'}
                  </button>
                  {saveMsg && (
                    <span className="small text-secondary">{saveMsg}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ManageLeads ──────────────────────────────────────────────────────────────
const ManageLeads = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const LIMIT = 10;

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = { page, limit: LIMIT, sort: '-createdAt' };
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;

      const data = await getBookings(params);
      setBookings(data?.bookings || data?.data || data || []);
      setTotalPages(data?.totalPages || Math.ceil((data?.total || 1) / LIMIT) || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Reset page when search or status filter changes
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingId(id);
      const updated = await updateBooking(id, { status });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: updated?.status || status } : b))
      );
      if (selectedBooking?._id === id) {
        setSelectedBooking((prev) => ({ ...prev, status: updated?.status || status }));
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateBooking = async (id, payload) => {
    const updated = await updateBooking(id, payload);
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, ...updated } : b))
    );
    return updated;
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return;
    try {
      setDeletingId(id);
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      if (selectedBooking?._id === id) setSelectedBooking(null);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete booking.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas)' }}>
      <AdminSidebar />

      <main className="flex-grow-1 p-4 p-lg-5">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <h1 className="h4 fw-bold tracking-tight mb-1">Inquiries & Leads</h1>
            <p className="text-secondary small mb-0">View, update, and manage all client event booking inquiries.</p>
          </div>
        </div>

        {/* Filters */}
        <div
          className="card-tactile p-3 mb-4"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div className="row g-2 align-items-end">
            <div className="col-12 col-md-6">
              <label className="form-label small text-muted mb-1">Search Inquiries</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by client name, email, phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label small text-muted mb-1">Filter by Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="text-capitalize">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-3">
              <button
                type="button"
                className="btn btn-outline-secondary btn-tactile w-100"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                  setPage(1);
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table or Empty States */}
        {loading ? (
          <div className="p-5 text-center">
            <Loader />
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : bookings.length === 0 ? (
          <div
            className="p-5 text-center text-muted card-tactile"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <i className="bi bi-inbox fs-2 d-block mb-2 text-muted" aria-hidden="true" />
            <p className="mb-0">No booking inquiries match your criteria.</p>
          </div>
        ) : (
          <>
            <div
              className="card-tactile overflow-hidden mb-3"
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
                      <th className="px-4">Client</th>
                      <th>Contact</th>
                      <th>Occasion</th>
                      <th>Target Date</th>
                      <th>Package Ref</th>
                      <th>Status</th>
                      <th className="text-end px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id}>
                        <td className="px-4">
                          <div className="fw-semibold text-dark">{b.name}</div>
                          <div className="text-muted small">{b.email}</div>
                        </td>
                        <td className="small text-secondary">{b.phone || '—'}</td>
                        <td className="text-capitalize small">{b.eventType || '—'}</td>
                        <td className="small text-secondary">
                          {b.eventDate
                            ? new Date(b.eventDate).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '—'}
                        </td>
                        <td className="small">{b.package?.title || b.packageName || 'Custom Inquiry'}</td>
                        <td>
                          <span className={`badge ${statusClass(b.status)} text-capitalize`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="text-end px-4">
                          <div className="d-inline-flex align-items-center gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary btn-tactile"
                              onClick={() => setSelectedBooking(b)}
                              title="View details"
                            >
                              View
                            </button>

                            <select
                              className="form-select form-select-sm"
                              style={{ width: 'auto', fontSize: '0.8rem', minWidth: '115px' }}
                              value={b.status}
                              disabled={updatingId === b._id}
                              onChange={(e) => handleStatusUpdate(b._id, e.target.value)}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s} className="text-capitalize">
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger btn-tactile"
                              disabled={deletingId === b._id}
                              onClick={() => handleDelete(b._id)}
                              title="Delete inquiry"
                            >
                              {deletingId === b._id ? '…' : <i className="bi bi-trash3" aria-hidden="true" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </main>

      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={handleUpdateBooking}
        />
      )}
    </div>
  );
};

export default ManageLeads;
