import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/leads', label: 'Manage Leads', icon: '📋', end: false },
  { to: '/admin/packages', label: 'Manage Packages', icon: '📦', end: false },
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
    width: collapsed ? '64px' : '240px',
    minHeight: '100vh',
    background: '#0d1b2a',
    transition: 'width 0.25s ease',
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
    padding: '10px 16px',
    borderRadius: '6px',
    marginBottom: '4px',
    color: isActive ? '#0d1b2a' : '#b0c4d8',
    background: isActive ? '#f5a623' : 'transparent',
    fontWeight: isActive ? '600' : '400',
    textDecoration: 'none',
    fontSize: '0.92rem',
    transition: 'background 0.18s, color 0.18s',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  });

  return (
    <div style={sidebarStyle}>
      {/* Brand */}
      <div
        className="d-flex align-items-center justify-content-between px-3 py-3"
        style={{ borderBottom: '1px solid #1e3a55' }}
      >
        {!collapsed && (
          <span className="fw-bold fs-5" style={{ color: '#f5a623', letterSpacing: '0.5px' }}>
            🐝 EventHive
          </span>
        )}
        <button
          className="btn btn-sm p-1"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{ color: '#b0c4d8', background: 'none', border: 'none', marginLeft: 'auto' }}
        >
          {collapsed ? '☰' : '✕'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-grow-1 px-2 pt-3">
        {NAV_LINKS.map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end} style={linkStyle} title={collapsed ? label : undefined}>
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</span>
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer: Admin name + Logout */}
      <div
        className="px-3 py-3"
        style={{ borderTop: '1px solid #1e3a55', overflow: 'hidden' }}
      >
        {!collapsed && admin?.name && (
          <div className="mb-2" style={{ color: '#7a9ab5', fontSize: '0.78rem' }}>
            <span style={{ color: '#f5a623' }}>👤</span>{' '}
            <span className="text-white-50">{admin.name}</span>
          </div>
        )}
        <button
          className="btn btn-sm w-100 fw-semibold"
          onClick={handleLogout}
          title="Logout"
          style={{
            background: '#1e3a55',
            color: '#f5a623',
            border: '1px solid #2e4057',
            fontSize: '0.85rem',
            padding: collapsed ? '8px 4px' : '6px 12px',
          }}
        >
          {collapsed ? '🚪' : '🚪 Logout'}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
