import { Link } from 'react-router-dom';

const quickLinks = [
  ['/', 'Home'],
  ['/packages', 'Explore packages'],
  ['/about', 'About us'],
  ['/contact', 'Contact'],
];

const eventCategories = [
  'Birthdays',
  'Weddings',
  'Corporate events',
  'Anniversaries',
  'Custom events',
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '64px',
        paddingBottom: '32px',
        color: 'var(--text-secondary)',
      }}
    >
      <div className="container">
        <div className="row g-4 g-lg-5 pb-5">
          {/* Brand & Location */}
          <div className="col-lg-4 col-md-12">
            <Link
              to="/"
              className="d-inline-flex align-items-center mb-3"
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
            <p
              className="mb-3"
              style={{
                fontSize: '14px',
                lineHeight: 1.7,
                color: 'var(--text-muted)',
                maxWidth: '340px',
              }}
            >
              Thoughtful, end-to-end event production and coordination for life's most meaningful celebrations.
            </p>
            <div
              className="d-flex align-items-center"
              style={{ fontSize: '13px', color: 'var(--text-secondary)' }}
            >
              <i className="bi bi-geo-alt me-2 text-dark" aria-hidden="true" />
              <span>Mathura, Uttar Pradesh, India</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="col-6 col-lg-2">
            <h6
              className="fw-bold text-uppercase mb-3"
              style={{
                fontSize: '11px',
                letterSpacing: '0.08em',
                color: 'var(--text-primary)',
              }}
            >
              Platform
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0" style={{ fontSize: '14px' }}>
              {quickLinks.map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-secondary"
                    style={{ textDecoration: 'none', transition: 'color 0.15s ease' }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Occasions */}
          <div className="col-6 col-lg-3">
            <h6
              className="fw-bold text-uppercase mb-3"
              style={{
                fontSize: '11px',
                letterSpacing: '0.08em',
                color: 'var(--text-primary)',
              }}
            >
              Occasions
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0" style={{ fontSize: '14px' }}>
              {eventCategories.map((category) => (
                <li key={category}>
                  <Link
                    to="/packages"
                    className="text-secondary"
                    style={{ textDecoration: 'none', transition: 'color 0.15s ease' }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-md-6 col-lg-3">
            <h6
              className="fw-bold text-uppercase mb-3"
              style={{
                fontSize: '11px',
                letterSpacing: '0.08em',
                color: 'var(--text-primary)',
              }}
            >
              Direct Inquiry
            </h6>
            <p className="small text-muted mb-3">
              Reach out directly to speak with an event specialist about your date.
            </p>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-3" style={{ fontSize: '14px' }}>
              <li>
                <a
                  href="tel:+919876543210"
                  className="text-secondary d-inline-flex align-items-center gap-2"
                  style={{ textDecoration: 'none' }}
                >
                  <i className="bi bi-telephone text-dark" aria-hidden="true" />
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@eventhive.in"
                  className="text-secondary d-inline-flex align-items-center gap-2"
                  style={{ textDecoration: 'none' }}
                >
                  <i className="bi bi-envelope text-dark" aria-hidden="true" />
                  hello@eventhive.in
                </a>
              </li>
            </ul>
            <Link
              to="/contact"
              className="fw-semibold small d-inline-flex align-items-center"
              style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
            >
              Send an inquiry
              <i className="bi bi-arrow-right ms-2 icon-nudge" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-4 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2"
          style={{
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {year} EventHive. Developed by Team EventHive, GLA University.
          </div>
          <div>
            <Link
              to="/login"
              className="text-muted"
              style={{ textDecoration: 'none', fontSize: '12px' }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
            >
              Client & Organizer Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
