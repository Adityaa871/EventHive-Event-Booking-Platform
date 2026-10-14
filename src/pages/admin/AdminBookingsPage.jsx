import React, { useState, useEffect } from 'react';
import { getBookingsApi, updateBookingApi, deleteBookingApi } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesText, setNotesText] = useState('');

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await getBookingsApi(params);
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateBookingApi(id, { status });
      loadBookings();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead inquiry?')) {
      try {
        await deleteBookingApi(id);
        loadBookings();
      } catch (err) {
        alert('Failed to delete booking');
      }
    }
  };

  const handleSaveNotes = async (id) => {
    try {
      await updateBookingApi(id, { internalNotes: notesText });
      setEditingNotesId(null);
      loadBookings();
    } catch (err) {
      alert('Failed to save notes');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Manage Booking Leads</h2>
          <p className="text-secondary small mb-0">Track and update client event inquiries</p>
        </div>

        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadBookings();
          }}
          className="mb-4"
        >
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by client name, email, phone, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-dark" type="submit">Search</button>
          </div>
        </form>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr className="text-muted small">
                  <th>Client</th>
                  <th>Event & Date</th>
                  <th>Location</th>
                  <th>Guests</th>
                  <th>Status</th>
                  <th>Internal Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <div className="fw-bold">{b.clientName}</div>
                      <div className="text-muted small">{b.email}</div>
                      <div className="text-muted small">{b.phone}</div>
                    </td>
                    <td>
                      <div className="fw-semibold">{b.eventType}</div>
                      <div className="text-muted small">{b.packageName}</div>
                      <div className="text-muted small">
                        {new Date(b.eventDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="small">{b.location}</td>
                    <td>{b.guestCount}</td>
                    <td><StatusBadge status={b.status} /></td>
                    <td>
                      {editingNotesId === b._id ? (
                        <div className="d-flex flex-column gap-1">
                          <textarea
                            className="form-control form-control-sm"
                            rows="2"
                            value={notesText}
                            onChange={(e) => setNotesText(e.target.value)}
                          />
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-success py-0"
                              onClick={() => handleSaveNotes(b._id)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-sm btn-secondary py-0"
                              onClick={() => setEditingNotesId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="small text-muted p-1 rounded"
                          style={{ cursor: 'pointer', minWidth: '120px', background: '#f8fafc' }}
                          onClick={() => {
                            setEditingNotesId(b._id);
                            setNotesText(b.internalNotes || '');
                          }}
                          title="Click to edit notes"
                        >
                          {b.internalNotes || <em>+ Add note</em>}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <select
                          className="form-select form-select-sm"
                          style={{ width: '120px' }}
                          value={b.status}
                          onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(b._id)}
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No leads found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingsPage;

