import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/" onClick={() => setExpanded(false)}>
          <span style={{ color: '#f5a623' }}>Event</span>
          <span style={{ color: '#ffffff' }}>Hive</span>
          <span style={{ fontSize: '1.4rem', marginLeft: '4px' }}>🐝</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/packages', label: 'Packages' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label }) => (
              <li key={to} className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`
                  }
                  to={to}
                  end={to === '/'}
                  onClick={() => setExpanded(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li className="nav-item ms-lg-2">
              <Link
                className="btn btn-warning btn-sm fw-semibold px-4"
                to="/book"
                style={{ borderRadius: '20px' }}
                onClick={() => setExpanded(false)}
              >
                Book Now
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

