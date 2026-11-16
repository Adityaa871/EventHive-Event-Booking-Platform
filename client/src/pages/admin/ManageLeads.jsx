import React, { useEffect, useState, useCallback } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import { getBookings, updateBooking, deleteBooking } from '../../services/bookingService';

const STATUS_OPTIONS = ['new', 'contacted', 'confirmed', 'cancelled'];

const statusVariant = (status) => {
  const map = {
    new: 'primary',
    contacted: 'info',
    confirmed: 'success',
    cancelled: 'danger',
  };
  return map[status] || 'secondary';
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
      setSaveMsg('Saved!');
      setTimeout(() => setSaveMsg(''), 2000);
    } catch {
      setSaveMsg('Error saving notes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div
            className="modal-header border-0"
            style={{ background: '#0d1b2a', color: '#f5a623' }}
          >
            <h5 className="modal-title fw-bold">📋 Booking Details</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            />
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <small className="text-muted">Name</small>
                <div className="fw-semibold">{booking.name}</div>
              </div>
              <div className="col-md-6">
                <small className="text-muted">Email</small>
                <div>{booking.email}</div>
              </div>
              <div className="col-md-6">
                <small className="text-muted">Phone</small>
                <div>{booking.phone || '—'}</div>
              </div>
              <div className="col-md-6">
                <small className="text-muted">Event Type</small>
                <div className="text-capitalize">{booking.eventType || '—'}</div>
              </div>
              <div className="col-md-6">
                <small className="text-muted">Event Date</small>
                <div>
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
                <small className="text-muted">Package</small>
                <div>{booking.package?.title || booking.packageName || '—'}</div>
              </div>
              <div className="col-md-6">
                <small className="text-muted">Status</small>
                <div>
                  <span
                    className={`badge bg-${statusVariant(booking.status)} text-capitalize`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <small className="text-muted">Submitted</small>
                <div>
                  {booking.createdAt
                    ? new Date(booking.createdAt).toLocaleString('en-IN')
                    : '—'}
                </div>
              </div>
              {booking.message && (
                <div className="col-12">
                  <small className="text-muted">Message from Client</small>
                  <div
                    className="p-2 rounded small"
                    style={{ background: '#f8f9fa', whiteSpace: 'pre-wrap' }}
                  >
                    {booking.message}
                  </div>
                </div>
              )}
              <div className="col-12">
                <label className="form-label text-muted small mb-1">Admin Notes</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal notes about this lead…"
                />
                <div className="d-flex align-items-center gap-2 mt-2">
                  <button
                    className="btn btn-sm fw-semibold"
                    style={{ background: '#0d1b2a', color: '#f5a623' }}
                    onClick={handleSaveNotes}
                    disabled={saving}
                  >
                    {saving ? 'Saving…' : 'Save Notes'}
                  </button>
                  {saveMsg && (
                    <span className="small text-success">{saveMsg}</span>
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

  // Debounce search
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
      // Refresh selected booking in modal if open
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
    if (!window.confirm('Are you sure you want to delete this booking? This cannot be undone.')) return;
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
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <AdminSidebar />

      <main className="flex-grow-1 p-4">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <h4 className="fw-bold mb-0" style={{ color: '#0d1b2a' }}>
              📋 Manage Leads
            </h4>
            <p className="text-muted small mb-0">View, update, and manage all booking inquiries.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-2 align-items-end">
              <div className="col-12 col-md-6">
                <label className="form-label small text-muted mb-1">Search</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email, phone…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label small text-muted mb-1">Status</label>
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
                  className="btn w-100"
                  style={{ background: '#0d1b2a', color: '#f5a623', border: 'none' }}
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
        </div>

        {/* Table */}
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : bookings.length === 0 ? (
          <div className="text-center text-muted py-5">No bookings found.</div>
        ) : (
          <>
            <div className="card border-0 shadow-sm mb-3">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ background: '#0d1b2a', color: '#f5a623' }}>
                    <tr>
                      <th className="px-3">Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Event Type</th>
                      <th>Event Date</th>
                      <th>Package</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id}>
                        <td className="px-3 fw-medium">{b.name}</td>
                        <td className="text-muted small">{b.email}</td>
                        <td className="small">{b.phone || '—'}</td>
                        <td className="text-capitalize small">{b.eventType || '—'}</td>
                        <td className="small">
                          {b.eventDate
                            ? new Date(b.eventDate).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '—'}
                        </td>
                        <td className="small">{b.package?.title || b.packageName || '—'}</td>
                        <td>
                          <span
                            className={`badge bg-${statusVariant(b.status)} text-capitalize`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1 flex-wrap">
                            {/* View Details */}
                            <button
                              className="btn btn-sm"
                              style={{
                                background: '#e8f0fe',
                                color: '#0d1b2a',
                                fontSize: '0.75rem',
                              }}
                              onClick={() => setSelectedBooking(b)}
                            >
                              View
                            </button>

                            {/* Status Update */}
                            <select
                              className="form-select form-select-sm"
                              style={{ width: 'auto', fontSize: '0.75rem' }}
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

                            {/* Delete */}
                            <button
                              className="btn btn-sm btn-danger"
                              style={{ fontSize: '0.75rem' }}
                              disabled={deletingId === b._id}
                              onClick={() => handleDelete(b._id)}
                            >
                              {deletingId === b._id ? '…' : '🗑'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </main>

      {/* Detail Modal */}
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
