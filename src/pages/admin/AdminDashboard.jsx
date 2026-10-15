import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBookingStatsApi, updateBookingApi } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await getBookingStatsApi();
      setStats(res.data.stats);
      setRecentBookings(res.data.recentBookings || []);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBookingApi(id, { status: newStatus });
      loadStats();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Admin Dashboard</h2>
          <p className="text-secondary small mb-0">Overview of client inquiries and package offerings</p>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <Link to="/admin/bookings" className="btn btn-outline-dark btn-sm">
            <i className="bi bi-people me-1"></i> All Leads
          </Link>
          <Link to="/admin/packages" className="btn btn-warning btn-sm text-dark fw-bold">
            <i className="bi bi-plus-circle me-1"></i> Manage Packages
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-5">
        <div className="col-md-3 col-6">
          <div className="card shadow-sm border-0 p-3 rounded-4 bg-white">
            <div className="text-muted small">Total Leads</div>
            <h3 className="fw-bold text-dark mt-1 mb-0">{stats?.totalLeads || 0}</h3>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card shadow-sm border-0 p-3 rounded-4 bg-white">
            <div className="text-muted small">New Inquiries</div>
            <h3 className="fw-bold text-warning mt-1 mb-0">{stats?.new || 0}</h3>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card shadow-sm border-0 p-3 rounded-4 bg-white">
            <div className="text-muted small">Confirmed Bookings</div>
            <h3 className="fw-bold text-success mt-1 mb-0">{stats?.confirmed || 0}</h3>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card shadow-sm border-0 p-3 rounded-4 bg-white">
            <div className="text-muted small">Active Packages</div>
            <h3 className="fw-bold text-primary mt-1 mb-0">{stats?.totalPackages || 0}</h3>
          </div>
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Recent Inquiries</h5>
          <Link to="/admin/bookings" className="small text-decoration-none">View All</Link>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr className="text-muted small">
                <th>Client</th>
                <th>Event Type</th>
                <th>Date</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div className="fw-bold">{b.clientName}</div>
                    <div className="text-muted small">{b.email} | {b.phone}</div>
                  </td>
                  <td>{b.eventType}</td>
                  <td>{new Date(b.eventDate).toLocaleDateString()}</td>
                  <td>{b.guestCount}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: '130px' }}
                      value={b.status}
                      onChange={(e) => handleStatusChange(b._id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No recent inquiries.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

