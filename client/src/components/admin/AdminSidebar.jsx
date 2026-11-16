import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: 'bi-grid-1x2', end: true },
  { to: '/admin/leads', label: 'Manage Leads', icon: 'bi-inbox', end: false },
  { to: '/admin/packages', label: 'Manage Packages', icon: 'bi-box-seam', end: false },
];

const AdminSidebar = () => {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  const sidebarStyle = {
    width: collapsed ? '68px' : '240px',
    minHeight: '100vh',
    backgroundColor: '#18181b',
    borderRight: '1px solid #27272a',
    transition: 'width 0.2s var(--ease-tactile)',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    flexShrink: 0,
    zIndex: 100,
  };

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: collapsed ? '0' : '10px',
    justifyContent: collapsed ? 'center' : 'flex-start',
    padding: '9px 12px',
    borderRadius: 'var(--radius-sm)',
    marginBottom: '4px',
    color: isActive ? '#ffffff' : '#a1a1aa',
    backgroundColor: isActive ? '#27272a' : 'transparent',
    fontWeight: isActive ? 600 : 500,
    textDecoration: 'none',
    fontSize: '13px',
    transition: 'all var(--transition-fast)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  });

  return (
    <div style={sidebarStyle}>
      {/* Brand & Collapse Header */}
      <div
        className="d-flex align-items-center justify-content-between px-3 py-3"
        style={{ borderBottom: '1px solid #27272a', minHeight: '68px' }}
      >
        {!collapsed && (
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold text-white fs-6" style={{ letterSpacing: '-0.03em' }}>
              EventHive
            </span>
            <span
              className="badge"
              style={{
                backgroundColor: '#27272a',
                color: '#a1a1aa',
                fontSize: '10px',
                padding: '2px 6px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Admin
            </span>
          </div>
        )}
        <button
          type="button"
          className="btn btn-sm p-1 border-0"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            color: '#a1a1aa',
            background: 'none',
            marginLeft: collapsed ? 'auto' : undefined,
            marginRight: collapsed ? 'auto' : undefined,
          }}
        >
          <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`} aria-hidden="true" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-grow-1 px-2 pt-3">
        {NAV_LINKS.map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end} style={linkStyle} title={collapsed ? label : undefined}>
            <i className={`bi ${icon}`} style={{ fontSize: '1.05rem', flexShrink: 0 }} aria-hidden="true" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer: Admin info & Logout */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid #27272a' }}>
        {!collapsed && admin?.name && (
          <div className="mb-2" style={{ color: '#a1a1aa', fontSize: '12px' }}>
            <span className="text-white-50 d-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Signed in as
            </span>
            <span className="text-white fw-semibold text-truncate d-block">{admin.name}</span>
          </div>
        )}
        <button
          type="button"
          className="btn btn-sm w-100 fw-semibold btn-tactile d-flex align-items-center justify-content-center gap-2"
          onClick={handleLogout}
          title="Logout"
          style={{
            backgroundColor: '#27272a',
            color: '#ffffff',
            border: '1px solid #3f3f46',
            fontSize: '12px',
            padding: collapsed ? '8px 0' : '7px 12px',
          }}
        >
          <i className="bi bi-box-arrow-right" aria-hidden="true" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
