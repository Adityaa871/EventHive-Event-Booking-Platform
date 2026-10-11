import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: '#ccc' }}>
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-4">
            <h5 className="fw-bold mb-3">
              <span style={{ color: '#f5a623' }}>Event</span>
              <span style={{ color: '#fff' }}>Hive 🐝</span>
            </h5>
            <p className="small mb-3">
              Your trusted partner for creating unforgettable events. From intimate celebrations
              to grand corporate galas — we make every moment magical.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-warning"><i className="bi bi-facebook fs-5"></i></a>
              <a href="#" className="text-warning"><i className="bi bi-instagram fs-5"></i></a>
              <a href="#" className="text-warning"><i className="bi bi-twitter-x fs-5"></i></a>
              <a href="#" className="text-warning"><i className="bi bi-linkedin fs-5"></i></a>
            </div>
          </div>

          <div className="col-sm-6 col-lg-2">
            <h6 className="text-white fw-semibold mb-3">Quick Links</h6>
            <ul className="list-unstyled small">
              {[['/', 'Home'], ['/packages', 'Packages'], ['/about', 'About Us'], ['/contact', 'Contact']].map(
                ([to, label]) => (
                  <li key={to} className="mb-2">
                    <Link to={to} className="text-decoration-none" style={{ color: '#ccc' }}>
                      {label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="col-sm-6 col-lg-3">
            <h6 className="text-white fw-semibold mb-3">Event Categories</h6>
            <ul className="list-unstyled small">
              {['Birthdays', 'Weddings', 'Corporate Events', 'Anniversaries', 'Custom Events'].map((cat) => (
                <li key={cat} className="mb-2">
                  <Link to="/packages" className="text-decoration-none" style={{ color: '#ccc' }}>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-3">
            <h6 className="text-white fw-semibold mb-3">Get In Touch</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><i className="bi bi-telephone-fill me-2 text-warning"></i>+91 98765 43210</li>
              <li className="mb-2"><i className="bi bi-envelope-fill me-2 text-warning"></i>hello@eventhive.in</li>
              <li className="mb-2"><i className="bi bi-geo-alt-fill me-2 text-warning"></i>Mathura, Uttar Pradesh</li>
            </ul>
          </div>
        </div>

        <hr style={{ borderColor: '#333', marginTop: '2rem' }} />
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <p className="small mb-0" style={{ color: '#888' }}>
            © {year} EventHive. Made with ❤️ by Team EventHive — GLA University.
          </p>
          <Link to="/admin/login" className="small text-decoration-none" style={{ color: '#555' }}>
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

