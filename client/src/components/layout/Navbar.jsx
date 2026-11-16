import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

const navigationLinks = [
  { to: '/', label: 'Home' },
  { to: '/packages', label: 'Packages' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);

  const closeMenu = () => setExpanded(false);

  const linkStyle = (isActive) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '42px',
    padding: '8px 14px',
    borderRadius: '7px',
    color: isActive ? '#2457a6' : '#596579',
    backgroundColor: isActive ? '#edf2f9' : 'transparent',
    fontSize: '15px',
    fontWeight: isActive ? 700 : 600,
    lineHeight: 1.4,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  });

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top"
      aria-label="Main navigation"
      style={{
        minHeight: '72px',
        padding: '10px 0',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e1e6ed',
        boxShadow: '0 2px 10px rgba(32, 43, 60, 0.04)',
        zIndex: 1030,
      }}
    >
      <div className="container">
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="EventHive home"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#202b3c',
            fontSize: '25px',
            fontWeight: 800,
            letterSpacing: '-1.2px',
            lineHeight: 1,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: '#2457a6' }}>Event</span>
          <span style={{ color: '#202b3c' }}>Hive</span>
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '25px',
              height: '25px',
              marginLeft: '7px',
              borderRadius: '7px',
              color: '#2457a6',
              backgroundColor: '#edf2f9',
              fontSize: '15px',
              letterSpacing: 0,
            }}
          >
            <i className="bi bi-asterisk" />
          </span>
        </Link>

        <button
          type="button"
          aria-label={expanded ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={expanded}
          aria-controls="event-navbar-menu"
          onClick={() => setExpanded((current) => !current)}
          className="navbar-toggler"
          style={{
            width: '42px',
            height: '42px',
            padding: '9px',
            border: '1px solid #e1e6ed',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: 'none',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
            }}
          >
            <span style={{ display: 'block', width: '18px', height: '2px', borderRadius: '2px', backgroundColor: '#202b3c' }} />
            <span style={{ display: 'block', width: '18px', height: '2px', borderRadius: '2px', backgroundColor: '#202b3c' }} />
            <span style={{ display: 'block', width: '18px', height: '2px', borderRadius: '2px', backgroundColor: '#202b3c' }} />
          </span>
        </button>

        <div
          id="event-navbar-menu"
          className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}
        >
          <ul
            className="navbar-nav ms-auto align-items-lg-center"
            style={{
              display: 'flex',
              gap: '8px',
              marginTop: '0',
              marginBottom: '0',
              padding: '0',
              listStyle: 'none',
            }}
          >
            {navigationLinks.map(({ to, label }) => (
              <li className="nav-item" key={to} style={{ display: 'flex', alignItems: 'center' }}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={closeMenu}
                  style={({ isActive }) => linkStyle(isActive)}
                >
                  {label}
                </NavLink>
              </li>
            ))}

            <li
              className="nav-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: '8px',
              }}
            >
              <Link
                to="/book"
                onClick={closeMenu}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '42px',
                  padding: '9px 18px',
                  border: '1px solid #2457a6',
                  borderRadius: '7px',
                  color: '#ffffff',
                  backgroundColor: '#2457a6',
                  fontSize: '14px',
                  fontWeight: 700,
                  lineHeight: 1.4,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Plan your event
                <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
