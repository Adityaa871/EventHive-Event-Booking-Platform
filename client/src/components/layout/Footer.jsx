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
    <footer className="event-footer">
      <div className="container">
        <div className="row g-4 g-lg-5 event-footer-main">
          <div className="col-lg-4 col-md-12">
            <Link to="/" className="event-footer-brand" aria-label="EventHive home">
              <span>Event</span>Hive
            </Link>
            <p className="event-footer-description">
              Thoughtful planning for the moments that matter. From intimate
              celebrations to large gatherings, EventHive helps bring your event
              together with care.
            </p>
            <p className="event-footer-location">
              <i className="bi bi-geo-alt me-2" aria-hidden="true" />
              Based in Mathura, Uttar Pradesh
            </p>
          </div>

          <nav className="col-6 col-lg-2" aria-label="Footer quick links">
            <h2 className="event-footer-heading">Explore</h2>
            <ul className="event-footer-list">
              {quickLinks.map(([to, label]) => (
                <li key={to}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-6 col-lg-3">
            <h2 className="event-footer-heading">Occasions</h2>
            <ul className="event-footer-list">
              {eventCategories.map((category) => (
                <li key={category}>
                  <Link to="/packages">{category}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-6 col-lg-3">
            <h2 className="event-footer-heading">Talk to our team</h2>
            <p className="event-footer-contact-intro">
              Have an idea or a question? Get in touch and let's discuss your event.
            </p>
            <ul className="event-footer-contact">
              <li>
                <i className="bi bi-telephone" aria-hidden="true" />
                <a href="tel:+919876543210">+91 98765 43210</a>
              </li>
              <li>
                <i className="bi bi-envelope" aria-hidden="true" />
                <a href="mailto:hello@eventhive.in">hello@eventhive.in</a>
              </li>
              <li>
                <i className="bi bi-geo-alt" aria-hidden="true" />
                <span>Mathura, Uttar Pradesh</span>
              </li>
            </ul>
            <Link to="/contact" className="event-footer-contact-link">
              Send us a message <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="event-footer-bottom">
          <p className="mb-0">
            © {year} EventHive. Made by Team EventHive at GLA University.
          </p>
          <Link to="/admin/login" className="event-footer-admin">
            Admin access
          </Link>
        </div>
      </div>
<style>{`
        .event-footer {
          --footer-ink: #202b3c;
          --footer-muted: #667085;
          --footer-primary: #2457a6;
          --footer-border: #e1e6ed;
          padding: 3.75rem 0 1.25rem;
          color: var(--footer-ink);
          background: #f4f6f9;
          border-top: 1px solid var(--footer-border);
        }

        .event-footer-main {
          padding-bottom: 2.75rem;
        }

        .event-footer-brand {
          display: inline-block;
          margin-bottom: 1rem;
          color: var(--footer-ink);
          font-size: 1.65rem;
          font-weight: 800;
          letter-spacing: -.055em;
          text-decoration: none;
        }

        .event-footer-brand span {
          color: var(--footer-primary);
        }

        .event-footer-description {
          max-width: 350px;
          margin-bottom: 1.25rem;
          color: var(--footer-muted);
          font-size: .92rem;
          line-height: 1.75;
        }

        .event-footer-location {
          display: flex;
          align-items: center;
          margin: 0;
          color: var(--footer-muted);
          font-size: .86rem;
        }

        .event-footer-location i {
          color: var(--footer-primary);
        }

        .event-footer-heading {
          margin: .35rem 0 1.15rem;
          color: var(--footer-ink);
          font-size: .9rem;
          font-weight: 750;
        }

        .event-footer-list,
        .event-footer-contact {
          display: flex;
          flex-direction: column;
          gap: .8rem;
          margin: 0;
          padding: 0;
list-style: none;
        }

        .event-footer-list a,
        .event-footer-contact a {
          color: var(--footer-muted);
          font-size: .88rem;
          text-decoration: none;
          transition: color .15s ease;
        }

        .event-footer-list a:hover,
        .event-footer-contact a:hover {
          color: var(--footer-primary);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .event-footer-contact-intro {
          margin: 0 0 1rem;
          color: var(--footer-muted);
          font-size: .86rem;
          line-height: 1.65;
        }

        .event-footer-contact li {
          display: flex;
          align-items: flex-start;
          gap: .7rem;
          color: var(--footer-muted);
          font-size: .88rem;
          line-height: 1.5;
        }

        .event-footer-contact li i {
          width: 16px;
          margin-top: .15rem;
          color: var(--footer-primary);
          text-align: center;
        }

        .event-footer-contact li span {
          color: var(--footer-muted);
        }

        .event-footer-contact-link {
          display: inline-flex;
          align-items: center;
          margin-top: 1.15rem;
          color: var(--footer-primary);
          font-size: .88rem;
          font-weight: 700;
          text-decoration: none;
        }

        .event-footer-contact-link:hover {
          color: #193f7c;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .event-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding-top: 1.15rem;
          border-top: 1px solid var(--footer-border);
        }

        .event-footer-bottom p {
          color: var(--footer-muted);
          font-size: .8rem;
          line-height: 1.5;
        }

        .event-footer-admin {
          color: #7b8798;
          font-size: .8rem;
          text-decoration: none;
        }

        .event-footer-admin:hover {
          color: var(--footer-primary);
          text-decoration: underline;
        }

        @media (max-width: 575.98px) {
          .event-footer {
            padding-top: 2.75rem;
          }

          .event-footer-main {
            row-gap: 2rem !important;
            padding-bottom: 2rem;
          }

          .event-footer-bottom {
            align-items: flex-start;
            flex-direction: column;
            gap: .6rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
