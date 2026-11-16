import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPackages } from '../services/packageService';
import Loader from '../components/common/Loader';
import PackageCard from '../components/packages/PackageCard';

const steps = [
  {
    number: '01',
    title: 'Select a curated package',
    description:
      'Explore transparent, all-inclusive packages across weddings, birthdays, and corporate galas designed by experienced planners.',
  },
  {
    number: '02',
    title: 'Specify dates and guest count',
    description:
      'Submit your target dates, venue preferences, and approximate guest counts through our inquiry form in under two minutes.',
  },
  {
    number: '03',
    title: 'Coordinate and celebrate',
    description:
      'Our team coordinates every vendor, decoration milestone, and schedule item so you can focus entirely on enjoying your celebration.',
  },
];

const testimonials = [
  {
    name: 'Sneha & Arjun Kapoor',
    event: 'Wedding Reception • 350 Guests',
    quote:
      'EventHive orchestrated our wedding with flawless timing and calm precision. From vendor arrivals to stage decor, every single detail felt natural and elevated.',
  },
  {
    name: 'Ramesh Agarwal',
    event: 'Corporate Annual Day • Mathura',
    quote:
      'Managing a 200-person leadership offsite used to mean frantic phone calls and last-minute chaos. EventHive gave us a calm, dependable point of contact.',
  },
  {
    name: 'Pooja Sharma',
    event: 'Birthday Celebration • 80 Guests',
    quote:
      'Transparent pricing with zero hidden surprises. The team understood our aesthetic immediately and delivered an evening our family still talks about.',
  },
];

const categories = [
  { id: 'wedding', label: 'Weddings & Receptions', count: 'Full production & decor' },
  { id: 'birthday', label: 'Milestone Birthdays', count: 'Themed styling & catering' },
  { id: 'corporate', label: 'Corporate Seminars', count: 'AV, staging & hospitality' },
  { id: 'anniversary', label: 'Anniversaries & Galas', count: 'Intimate & grand dining' },
];

const stats = [
  { value: '500+', label: 'Events executed' },
  { value: '1,000+', label: 'Clients hosted' },
  { value: '10+', label: 'Years of coordination' },
];

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getPackages({ featured: true, limit: 3 });
        setFeaturedPackages(data.packages || data || []);
      } catch (err) {
        console.error('Failed to fetch featured packages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="reveal-fade-up">
      {/* ── 1. Hero Section: Split Editorial Layout ── */}
      <section
        style={{
          backgroundColor: 'var(--bg-canvas)',
          borderBottom: '1px solid var(--border-subtle)',
          paddingTop: '80px',
          paddingBottom: '88px',
        }}
      >
        <div className="container">
          <div className="row align-items-center g-5">
            {/* Left Content */}
            <div className="col-lg-7">
              <div
                className="d-inline-flex align-items-center gap-2 mb-3 px-3 py-1 text-secondary"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-surface)',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand-accent)',
                    display: 'inline-block',
                  }}
                />
                Event Production & Booking • Mathura, UP
              </div>

              <h1 className="display-4 fw-bold mb-4" style={{ maxWidth: '640px' }}>
                Curated event packages, executed with editorial precision.
              </h1>

              <p
                className="lead text-secondary mb-4"
                style={{ maxWidth: '540px', fontSize: '1.1rem', lineHeight: 1.7 }}
              >
                From intimate family gatherings to grand multi-day celebrations, EventHive pairs transparent package pricing with dedicated day-of coordinators.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-5">
                <Link to="/packages" className="btn btn-primary btn-tactile">
                  Browse packages
                  <i className="bi bi-arrow-right ms-2 icon-nudge" aria-hidden="true" />
                </Link>
                <Link to="/book" className="btn btn-outline-primary btn-tactile">
                  Plan custom event
                </Link>
              </div>

              {/* Grounded Stats Strip */}
              <div
                className="d-flex flex-wrap gap-4 pt-4"
                style={{ borderTop: '1px solid var(--border-subtle)', maxWidth: '520px' }}
              >
                {stats.map((s) => (
                  <div key={s.label} className="d-flex flex-column">
                    <span
                      className="fw-bold"
                      style={{
                        fontSize: '1.6rem',
                        letterSpacing: '-0.03em',
                        color: 'var(--text-primary)',
                        lineHeight: 1.1,
                      }}
                    >
                      {s.value}
                    </span>
                    <span className="small text-muted mt-1">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Asymmetrical Card Stack */}
            <div className="col-lg-5">
              <div
                className="p-4"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                  <span className="fw-bold text-uppercase small" style={{ letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                    Core Specializations
                  </span>
                  <Link to="/packages" className="small fw-semibold text-secondary">
                    All categories →
                  </Link>
                </div>

                <div className="d-flex flex-column gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to="/packages"
                      className="p-3 d-flex align-items-center justify-content-between rounded-2 card-tactile"
                      style={{
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div>
                        <div className="fw-bold" style={{ fontSize: '14px', letterSpacing: '-0.01em' }}>
                          {cat.label}
                        </div>
                        <div className="small text-muted">{cat.count}</div>
                      </div>
                      <i className="bi bi-chevron-right text-muted icon-nudge" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Featured Packages Grid ── */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          paddingTop: '80px',
          paddingBottom: '88px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container">
          <div className="d-flex flex-column flex-md-row md-align-items-end justify-content-between mb-5 gap-3">
            <div>
              <div className="text-uppercase small fw-bold text-muted mb-2" style={{ letterSpacing: '0.08em' }}>
                Curated Selections
              </div>
              <h2 className="mb-0">Featured event packages</h2>
            </div>
            <div>
              <Link to="/packages" className="btn btn-outline-secondary btn-tactile btn-sm">
                View catalog ({featuredPackages.length} packages)
                <i className="bi bi-arrow-right ms-2 icon-nudge" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="py-5 text-center">
              <Loader />
            </div>
          ) : featuredPackages.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>No featured packages at this moment.</p>
              <Link to="/packages" className="btn btn-outline-primary btn-sm">
                Explore all packages
              </Link>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {featuredPackages.map((pkg) => (
                <div className="col" key={pkg._id}>
                  <PackageCard pkg={pkg} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 3. Structured Process / How It Works ── */}
      <section
        style={{
          backgroundColor: 'var(--bg-canvas)',
          paddingTop: '80px',
          paddingBottom: '88px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container">
          <div className="mb-5" style={{ maxWidth: '600px' }}>
            <div className="text-uppercase small fw-bold text-muted mb-2" style={{ letterSpacing: '0.08em' }}>
              Execution Workflow
            </div>
            <h2>How booking with EventHive works</h2>
            <p className="text-muted">
              We replace chaotic group chats, fragmented vendor estimates, and vague timelines with a structured, three-phase delivery model.
            </p>
          </div>

          <div className="row g-4">
            {steps.map((step) => (
              <div className="col-md-4" key={step.number}>
                <div
                  className="p-4 h-100 card-tactile"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                  }}
                >
                  <div
                    className="fw-bold mb-3"
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    PHASE {step.number}
                  </div>
                  <h3 className="h5 fw-bold mb-3">{step.title}</h3>
                  <p className="small text-muted mb-0" style={{ lineHeight: 1.7 }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Editorial Testimonials ── */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          paddingTop: '80px',
          paddingBottom: '88px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container">
          <div className="mb-5 text-center" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div className="text-uppercase small fw-bold text-muted mb-2" style={{ letterSpacing: '0.08em' }}>
              Verified Client Notes
            </div>
            <h2>Real feedback from recent hosts</h2>
          </div>

          <div className="row g-4">
            {testimonials.map((t) => (
              <div className="col-md-4" key={t.name}>
                <div
                  className="p-4 h-100 d-flex flex-column justify-content-between card-tactile"
                  style={{ backgroundColor: 'var(--bg-canvas)' }}
                >
                  <p
                    className="text-secondary mb-4"
                    style={{
                      fontSize: '14px',
                      lineHeight: 1.75,
                      fontStyle: 'normal',
                    }}
                  >
                    “{t.quote}”
                  </p>
                  <div className="pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="fw-bold" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      {t.name}
                    </div>
                    <div className="small text-muted">{t.event}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Grounded Final CTA Banner ── */}
      <section
        style={{
          backgroundColor: 'var(--brand-primary)',
          color: 'var(--text-inverse)',
          paddingTop: '72px',
          paddingBottom: '76px',
        }}
      >
        <div className="container text-center">
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="display-6 fw-bold text-white mb-3">
              Ready to begin planning your event?
            </h2>
            <p className="text-white-50 mb-4" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
              Tell us your approximate date, preferred location, and attendee count. A coordinator will provide an initial quote within 24 hours.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link
                to="/book"
                className="btn btn-tactile"
                style={{
                  backgroundColor: '#ffffff',
                  color: 'var(--brand-primary)',
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '10px 20px',
                }}
              >
                Inquire now
                <i className="bi bi-arrow-right ms-2 icon-nudge" aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                className="btn btn-tactile text-white"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  fontSize: '14px',
                  padding: '10px 20px',
                }}
              >
                Contact details
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
