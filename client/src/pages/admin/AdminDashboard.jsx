import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getBookingStats, getBookings } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';

// ─── StatCard ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon, helper }) => (
  <div className="col-12 col-sm-6 col-xl-3">
    <div
      className="p-4 card-tactile h-100"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span
          className="text-uppercase small fw-bold text-muted"
          style={{ letterSpacing: '0.05em', fontSize: '11px' }}
        >
          {title}
        </span>
        <i className={`bi ${icon} text-muted`} aria-hidden="true" />
      </div>
      <div
        className="display-6 fw-bold text-dark mb-1"
        style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}
      >
        {value ?? '—'}
      </div>
      <div className="small text-muted">{helper}</div>
    </div>
  </div>
);

// ─── Status badge helper ──────────────────────────────────────────────────────
const statusClass = (status) => {
  const map = {
    new: 'status-new',
    contacted: 'status-contacted',
    confirmed: 'status-confirmed',
    cancelled: 'status-cancelled',
  };
  return map[status] || 'badge-neutral';
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
      title: 'Total Inquiries',
      value: stats?.total,
      icon: 'bi-inbox',
      helper: 'All recorded leads',
    },
    {
      title: 'Action Required',
      value: stats?.new,
      icon: 'bi-bell',
      helper: 'Awaiting phone follow-up',
    },
    {
      title: 'Confirmed Events',
      value: stats?.confirmed,
      icon: 'bi-check2-circle',
      helper: 'Deposit & contract signed',
    },
    {
      title: 'Closed / Cancelled',
      value: stats?.cancelled,
      icon: 'bi-x-circle',
      helper: 'Passed or unavailable',
    },
  ];

  return (
    <div className="d-flex admin-layout" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas)' }}>
      <AdminSidebar />

      <main className="flex-grow-1 p-4 p-md-5 reveal-fade-up">
        {/* Header */}
        <div className="d-flex flex-column flex-sm-row sm-align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
          <div>
            <h1 className="h3 fw-bold mb-1">
              Welcome back, {admin?.name || 'Administrator'}
            </h1>
            <p className="text-muted small mb-0">Overview of client inquiries, package catalog, and coordination metrics.</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin/leads" className="btn btn-primary btn-tactile btn-sm">
              <i className="bi bi-inbox me-2" aria-hidden="true" />
              Manage leads
            </Link>
            <Link to="/admin/packages" className="btn btn-outline-secondary btn-tactile btn-sm">
              <i className="bi bi-box-seam me-2" aria-hidden="true" />
              Packages
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        {loadingStats ? (
          <div className="py-4 text-center">
            <Loader />
          </div>
        ) : statsError ? (
          <ErrorMessage message={statsError} />
        ) : (
          <div className="row g-3 mb-5">
            {statCards.map((card) => (
              <StatCard key={card.title} {...card} />
            ))}
          </div>
        )}

        {/* Recent Bookings Table */}
        <div
          className="card-tactile overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div
            className="p-3 px-4 d-flex align-items-center justify-content-between border-bottom"
            style={{ backgroundColor: 'var(--bg-surface)' }}
          >
            <span className="fw-bold text-dark small text-uppercase" style={{ letterSpacing: '0.04em' }}>
              Recent Client Inquiries
            </span>
            <Link to="/admin/leads" className="small text-secondary fw-semibold">
              View all ({stats?.total || recentBookings.length}) →
            </Link>
          </div>

          <div className="p-0">
            {loadingBookings ? (
              <div className="p-5 text-center">
                <Loader />
              </div>
            ) : bookingsError ? (
              <div className="p-4">
                <ErrorMessage message={bookingsError} />
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="p-5 text-center text-muted small">No inquiries recorded yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th className="px-4">Client Name</th>
                      <th>Email</th>
                      <th>Occasion</th>
                      <th>Target Date</th>
                      <th>Package Ref</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((b) => (
                      <tr key={b._id}>
                        <td className="px-4 fw-semibold text-dark">{b.name}</td>
                        <td className="text-secondary small">{b.email}</td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
