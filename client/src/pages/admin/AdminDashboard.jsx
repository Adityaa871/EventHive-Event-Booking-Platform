import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getBookingStats, getBookings } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';

// ─── StatCard ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon, color }) => (
  <div className="col-12 col-sm-6 col-xl-3">
    <div className={`card border-0 text-white ${color} shadow-sm h-100`}>
      <div className="card-body d-flex align-items-center gap-3">
        <div style={{ fontSize: '2.4rem', lineHeight: 1 }}>{icon}</div>
        <div>
          <div className="fs-2 fw-bold lh-1">{value ?? '—'}</div>
          <div className="small opacity-75 mt-1">{title}</div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Status badge helper ──────────────────────────────────────────────────────
const statusVariant = (status) => {
  const map = {
    new: 'primary',
    contacted: 'info',
    confirmed: 'success',
    cancelled: 'danger',
  };
  return map[status] || 'secondary';
};

// ─── AdminDashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { admin } = useAuth();

  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [statsError, setStatsError] = useState('');
  const [bookingsError, setBookingsError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const data = await getBookingStats();
        setStats(data);
      } catch (err) {
        setStatsError(err?.response?.data?.message || 'Failed to load stats.');
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchRecent = async () => {
      try {
        setLoadingBookings(true);
        const data = await getBookings({ limit: 5, sort: '-createdAt' });
        setRecentBookings(data?.bookings || data || []);
      } catch (err) {
        setBookingsError(err?.response?.data?.message || 'Failed to load recent bookings.');
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchStats();
    fetchRecent();
  }, []);

  const statCards = [
    {
      title: 'Total Leads',
      value: stats?.total,
      icon: '📁',
      color: 'bg-primary',
    },
    {
      title: 'New Leads',
      value: stats?.new,
      icon: '🆕',
      color: 'bg-info',
    },
    {
      title: 'Confirmed',
      value: stats?.confirmed,
      icon: '✅',
      color: 'bg-success',
    },
    {
      title: 'Cancelled',
      value: stats?.cancelled,
      icon: '❌',
      color: 'bg-danger',
    },
  ];

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <AdminSidebar />

      <main className="flex-grow-1 p-4">
        {/* Header */}
        <div className="mb-4">
          <h4 className="fw-bold mb-0" style={{ color: '#0d1b2a' }}>
            👋 Welcome back, {admin?.name || 'Admin'}!
          </h4>
          <p className="text-muted small mb-0">Here's what's happening with EventHive today.</p>
        </div>

        {/* Stat Cards */}
        {loadingStats ? (
          <Loader />
        ) : statsError ? (
          <ErrorMessage message={statsError} />
        ) : (
          <div className="row g-3 mb-4">
            {statCards.map((card) => (
              <StatCard key={card.title} {...card} />
            ))}
          </div>
        )}

        {/* Quick Links */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          <Link
            to="/admin/leads"
            className="btn btn-sm fw-semibold"
            style={{ background: '#0d1b2a', color: '#f5a623', border: 'none' }}
          >
            📋 Manage Leads
          </Link>
          <Link
            to="/admin/packages"
            className="btn btn-sm fw-semibold"
            style={{ background: '#f5a623', color: '#0d1b2a', border: 'none' }}
          >
            📦 Manage Packages
          </Link>
        </div>

        {/* Recent Bookings Table */}
        <div className="card border-0 shadow-sm">
          <div
            className="card-header border-0 fw-semibold"
            style={{ background: '#0d1b2a', color: '#f5a623' }}
          >
            🕐 5 Most Recent Bookings
          </div>
          <div className="card-body p-0">
            {loadingBookings ? (
              <div className="p-4">
                <Loader />
              </div>
            ) : bookingsError ? (
              <div className="p-4">
                <ErrorMessage message={bookingsError} />
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="p-4 text-center text-muted">No bookings found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th className="px-3">Name</th>
                      <th>Email</th>
                      <th>Event Type</th>
                      <th>Event Date</th>
                      <th>Package</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((b) => (
                      <tr key={b._id}>
                        <td className="px-3 fw-medium">{b.name}</td>
                        <td className="text-muted small">{b.email}</td>
                        <td>{b.eventType || '—'}</td>
                        <td>
                          {b.eventDate
                            ? new Date(b.eventDate).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '—'}
                        </td>
                        <td>{b.package?.title || b.packageName || '—'}</td>
                        <td>
                          <span className={`badge bg-${statusVariant(b.status)} text-capitalize`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="card-footer bg-transparent border-0 text-end">
            <Link
              to="/admin/leads"
              className="btn btn-sm"
              style={{ color: '#0d1b2a', fontWeight: 600 }}
            >
              View All Leads →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
