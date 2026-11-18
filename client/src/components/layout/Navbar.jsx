import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const navigationLinks = [
  { to: '/', label: 'Home' },
  { to: '/packages', label: 'Packages' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  const closeMenu = () => setExpanded(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top"
      aria-label="Main navigation"
      style={{
        height: '68px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        zIndex: 1030,
      }}
    >
      <div className="container">
        {/* Editorial Wordmark */}
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="EventHive home"
          className="d-inline-flex align-items-center"
          style={{
            textDecoration: 'none',
            color: 'var(--text-primary)',
            fontWeight: 800,
            fontSize: '20px',
            letterSpacing: '-0.04em',
          }}
        >
          <span>Event</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 500, marginLeft: '2px' }}>Hive</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          type="button"
          aria-label={expanded ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={expanded}
          aria-controls="navbar-menu"
          onClick={() => setExpanded((current) => !current)}
          className="navbar-toggler border-0 p-2"
          style={{
            boxShadow: 'none',
            color: 'var(--text-primary)',
          }}
        >
          <i className={`bi ${expanded ? 'bi-x-lg' : 'bi-list'}`} style={{ fontSize: '1.25rem' }} />
        </button>

        {/* Nav Links */}
        <div
          id="navbar-menu"
          className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}
          style={{
            backgroundColor: expanded ? 'var(--bg-surface)' : 'transparent',
            padding: expanded ? '16px 0' : 0,
            borderBottom: expanded ? '1px solid var(--border-subtle)' : 'none',
          }}
        >
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1 mb-0">
            {navigationLinks.map(({ to, label }) => (
              <li className="nav-item" key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 rounded-2 ${isActive ? 'fw-bold text-dark' : 'text-secondary'}`
                  }
                  style={({ isActive }) => ({
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--bg-surface-subtle)' : 'transparent',
                    transition: 'all 0.15s ease',
                  })}
                >
                  {label}
                </NavLink>
              </li>
            ))}

            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <li className="nav-item">
                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      className="nav-link px-3 py-2 text-dark fw-semibold"
                      style={{ fontSize: '14px' }}
                    >
                      <i className="bi bi-grid-1x2 me-1" />
                      Admin
                    </Link>
                  </li>
                ) : (
                  <li className="nav-item">
                    <NavLink
                      to="/my-bookings"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `nav-link px-3 py-2 rounded-2 ${isActive ? 'fw-bold text-dark' : 'text-secondary'}`
                      }
                      style={({ isActive }) => ({
                        fontSize: '14px',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        backgroundColor: isActive ? 'var(--bg-surface-subtle)' : 'transparent',
                        transition: 'all 0.15s ease',
                      })}
                    >
                      <i className="bi bi-calendar-check me-1" />
                      Reservations
                    </NavLink>
                  </li>
                )}

                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-secondary text-decoration-none px-2"
                    style={{ fontSize: '13px' }}
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="nav-link px-3 py-2 text-secondary fw-semibold"
                  style={{ fontSize: '14px' }}
                >
                  Sign In
                </Link>
              </li>
            )}

            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <Link
                to="/book"
                onClick={closeMenu}
                className="btn btn-primary btn-tactile"
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  padding: '8px 16px',
                }}
              >
                Plan your event
                <i className="bi bi-arrow-right ms-2 icon-nudge" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
