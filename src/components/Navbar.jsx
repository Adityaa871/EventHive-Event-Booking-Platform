import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const closeNav = () => setIsNavCollapsed(true);

  const handleLogout = () => {
    logout();
    navigate('/');
    closeNav();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={closeNav}>
          <span className="fs-3">✨</span>
          <span className="navbar-brand-logo">EventHive</span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          aria-controls="navbarEventHive"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarEventHive">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-1">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end onClick={closeNav}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/packages" onClick={closeNav}>
                Event Packages
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/book" onClick={closeNav}>
                Book Inquiry
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about" onClick={closeNav}>
                About & Contact
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-sm btn-outline-light dropdown-toggle d-flex align-items-center gap-2 py-2 px-3 rounded-pill"
                  type="button"
                  id="adminDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={(e) => {
                    const menu = e.currentTarget.nextElementSibling;
                    if (menu) menu.classList.toggle('show');
                  }}
                >
                  <i className="bi bi-shield-lock-fill text-warning"></i>
                  <span>Admin: {user?.name?.split(' ')[0] || 'Admin'}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2">
                  <li>
                    <Link className="dropdown-item py-2 rounded" to="/admin/dashboard" onClick={closeNav}>
                      <i className="bi bi-speedometer2 me-2 text-primary"></i> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 rounded" to="/admin/bookings" onClick={closeNav}>
                      <i className="bi bi-envelope-paper me-2 text-info"></i> Manage Leads
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 rounded" to="/admin/packages" onClick={closeNav}>
                      <i className="bi bi-boxes me-2 text-warning"></i> Manage Packages
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 rounded text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/admin/login" className="btn btn-sm btn-outline-custom" onClick={closeNav}>
                <i className="bi bi-person-lock me-1"></i> Admin Portal
              </Link>
            )}

            <Link to="/book" className="btn btn-sm btn-primary-custom" onClick={closeNav}>
              Get a Quote
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

