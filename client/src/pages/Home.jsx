import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPackages } from '../services/packageService';
import Loader from '../components/common/Loader';

const steps = [
  {
    number: '01',
    icon: 'bi-grid-1x2-fill',
    title: 'Browse Packages',
    description:
      'Explore our curated collection of event packages — from intimate birthdays to grand weddings. Filter by category, budget, and more.',
    color: 'primary',
  },
  {
    number: '02',
    icon: 'bi-calendar-check-fill',
    title: 'Book Your Date',
    description:
      'Pick your perfect package, fill in your event details, and secure your date in minutes. Our team will confirm within 24 hours.',
    color: 'success',
  },
  {
    number: '03',
    icon: 'bi-balloon-heart-fill',
    title: 'Celebrate!',
    description:
      'Sit back and relax while we handle every detail. Show up to your event and create memories that last a lifetime.',
    color: 'warning',
  },
];

const testimonials = [
  {
    name: 'Sneha & Arjun Kapoor',
    event: 'Wedding Reception',
    initials: 'SK',
    color: 'primary',
    rating: 5,
    quote:
      "EventHive turned our dream wedding into reality. Every detail was perfect — from the floral arrangements to the live music. We couldn't have asked for a more magical evening!",
  },
  {
    name: 'Ramesh Agarwal',
    event: 'Corporate Annual Day',
    initials: 'RA',
    color: 'success',
    rating: 5,
    quote:
      'Professional, organized, and absolutely on point. Our 200-person corporate event ran flawlessly. The EventHive team impressed our entire leadership team. Highly recommended!',
  },
  {
    name: 'Pooja Sharma',
    event: "Daughter's Birthday",
    initials: 'PS',
    color: 'warning',
    rating: 5,
    quote:
      "My daughter's 7th birthday was straight out of a fairy tale! The decorations, cake, and entertainment were beyond what I imagined. EventHive made her day truly special.",
  },
];

const categories = [
  { icon: 'bi-balloon-heart', label: 'Birthdays', color: 'primary' },
  { icon: 'bi-gem', label: 'Weddings', color: 'danger' },
  { icon: 'bi-briefcase', label: 'Corporate', color: 'dark' },
  { icon: 'bi-heart', label: 'Anniversaries', color: 'success' },
];

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getPackages({ featured: true, limit: 6 });
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
    <>
      {/* ── Hero ── */}
      <section
        className="position-relative text-white overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a0533 0%, #0d1b6e 50%, #0d6efd 100%)',
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* decorative orbs */}
        <div
          className="position-absolute rounded-circle opacity-10"
          style={{
            width: '500px',
            height: '500px',
            background: '#6f42c1',
            top: '-150px',
            right: '-150px',
            filter: 'blur(80px)',
          }}
        ></div>
        <div
          className="position-absolute rounded-circle opacity-10"
          style={{
            width: '400px',
            height: '400px',
            background: '#0dcaf0',
            bottom: '-100px',
            left: '-100px',
            filter: 'blur(80px)',
          }}
        ></div>

        <div className="container position-relative py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge bg-white bg-opacity-10 border border-white border-opacity-25 text-white fw-normal mb-4 px-3 py-2 fs-6">
                <i className="bi bi-stars me-2 text-warning"></i>
                Mathura's Premier Event Planners
              </span>
              <h1 className="display-3 fw-black lh-1 mb-4">
                Create Moments
                <br />
                <span
                  style={{
                    background: 'linear-gradient(90deg, #ffd700, #ff6b6b)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  That Last Forever
                </span>
              </h1>
              <p className="fs-5 opacity-75 mb-5" style={{ maxWidth: '540px' }}>
                From intimate birthdays to grand weddings — EventHive crafts extraordinary
                celebrations with precision, passion, and personality.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link
                  to="/packages"
                  className="btn btn-warning btn-lg fw-bold px-5 rounded-pill shadow-lg"
                  style={{ color: '#1a0533' }}
                >
                  <i className="bi bi-grid me-2"></i>
                  Browse Packages
                </Link>
                <Link
                  to="/book"
                  className="btn btn-outline-light btn-lg px-5 rounded-pill"
                >
                  <i className="bi bi-calendar-plus me-2"></i>
                  Book Now
                </Link>
              </div>

              {/* Mini stats */}
              <div className="d-flex gap-4 mt-5 flex-wrap">
                {[
                  { num: '500+', label: 'Events Done' },
                  { num: '1000+', label: 'Happy Clients' },
                  { num: '10+', label: 'Years Experience' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="fw-black fs-4">{s.num}</div>
                    <div className="small opacity-60">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-5 d-none d-lg-block">
              <div className="row g-3">
                {categories.map((cat, i) => (
                  <div key={i} className="col-6">
                    <div
                      className="rounded-4 p-4 text-center"
                      style={{
                        background: 'rgba(255,255,255,0.07)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        transform: i % 2 === 1 ? 'translateY(20px)' : '',
                      }}
                    >
                      <i className={`bi ${cat.icon} fs-1 text-${cat.color} mb-2 d-block`}></i>
                      <div className="fw-semibold small">{cat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Packages ── */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-primary-subtle text-primary fw-semibold mb-3 px-3 py-2">
              Featured Packages
            </span>
            <h2 className="display-6 fw-bold">Packages Made for You</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '520px' }}>
              Handpicked selections from our most popular event packages. Something for every
              occasion and every budget.
            </p>
          </div>

          {loading ? (
            <div className="py-5">
              <Loader />
            </div>
          ) : featuredPackages.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-box-seam fs-1 d-block mb-3 opacity-40"></i>
              <p>No featured packages available at the moment.</p>
              <Link to="/packages" className="btn btn-primary rounded-pill px-4">
                View All Packages
              </Link>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {featuredPackages.map((pkg) => (
                  <div key={pkg._id} className="col-md-6 col-lg-4">
                    <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden hover-card">
                      {/* Image */}
                      <div
                        className="position-relative"
                        style={{ height: '200px', overflow: 'hidden' }}
                      >
                        {pkg.images?.[0] ? (
                          <img
                            src={pkg.images[0]}
                            alt={pkg.title || pkg.name}
                            className="w-100 h-100"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            className="w-100 h-100 d-flex align-items-center justify-content-center"
                            style={{
                              background:
                                'linear-gradient(135deg, #e8f4fd 0%, #f3e8ff 100%)',
                            }}
                          >
                            <i className="bi bi-image text-primary opacity-30 fs-1"></i>
                          </div>
                        )}
                        {pkg.category && (
                          <span className="position-absolute top-0 start-0 m-3 badge bg-primary">
                            {pkg.category}
                          </span>
                        )}
                      </div>

                      <div className="card-body d-flex flex-column p-4">
                        <h5 className="fw-bold mb-2">{pkg.title || pkg.name}</h5>
                        <p className="text-muted small mb-3 flex-grow-1">
                          {pkg.shortDescription || pkg.description?.slice(0, 100)}
                          {!pkg.shortDescription && pkg.description?.length > 100 ? '…' : ''}
                        </p>

                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div>
                            {pkg.price && (
                              <span className="fs-5 fw-bold text-primary">
                                ₹{pkg.price.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          {pkg.capacity && (
                            <span className="badge bg-light text-muted border">
                              <i className="bi bi-people me-1"></i>
                              {pkg.capacity} guests
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/packages/${pkg._id}`}
                          className="btn btn-outline-primary rounded-pill w-100"
                        >
                          View Details
                          <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-5">
                <Link to="/packages" className="btn btn-primary btn-lg rounded-pill px-5">
                  <i className="bi bi-grid me-2"></i>
                  View All Packages
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-success-subtle text-success fw-semibold mb-3 px-3 py-2">
              Simple Process
            </span>
            <h2 className="display-6 fw-bold">How It Works</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '480px' }}>
              Getting your dream event started is easier than you think.
            </p>
          </div>

          <div className="row g-4 align-items-start">
            {steps.map((step, i) => (
              <div key={i} className="col-md-4">
                <div className="card border-0 rounded-4 p-4 h-100 text-center position-relative shadow-sm">
                  <div
                    className="position-absolute top-0 end-0 m-3 fw-black opacity-10"
                    style={{ fontSize: '3.5rem', lineHeight: 1 }}
                  >
                    {step.number}
                  </div>
                  <div
                    className={`rounded-circle bg-${step.color} bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-4`}
                    style={{ width: '80px', height: '80px' }}
                  >
                    <i className={`bi ${step.icon} text-${step.color} fs-2`}></i>
                  </div>
                  <h5 className="fw-bold mb-3">{step.title}</h5>
                  <p className="text-muted mb-0 small">{step.description}</p>

                  {i < steps.length - 1 && (
                    <div className="d-none d-md-block position-absolute top-50 end-0 translate-middle-y me-n3">
                      <i className="bi bi-chevron-right text-muted fs-4"></i>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-warning-subtle text-warning fw-semibold mb-3 px-3 py-2">
              Client Love
            </span>
            <h2 className="display-6 fw-bold">What Our Clients Say</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '480px' }}>
              Don't take our word for it — hear directly from the families and businesses we've
              served.
            </p>
          </div>

          <div className="row g-4">
            {testimonials.map((t, i) => (
              <div key={i} className="col-md-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                  {/* Stars */}
                  <div className="text-warning mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <i key={j} className="bi bi-star-fill me-1"></i>
                    ))}
                  </div>
                  <p className="text-muted fst-italic mb-4">"{t.quote}"</p>
                  <div className="d-flex align-items-center gap-3 mt-auto">
                    <div
                      className={`rounded-circle bg-${t.color} d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0`}
                      style={{ width: '48px', height: '48px' }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div className="fw-bold small">{t.name}</div>
                      <div className="text-muted small">{t.event}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className="py-5 text-white text-center position-relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #6f42c1 0%, #0d6efd 100%)' }}
      >
        <div
          className="position-absolute rounded-circle opacity-10"
          style={{
            width: '400px',
            height: '400px',
            background: '#fff',
            top: '-200px',
            left: '50%',
            transform: 'translateX(-50%)',
            filter: 'blur(60px)',
          }}
        ></div>
        <div className="container position-relative py-4">
          <i className="bi bi-balloon-heart-fill fs-1 text-warning mb-3 d-block"></i>
          <h2 className="display-5 fw-black mb-3">
            Your Perfect Event Starts Here
          </h2>
          <p className="lead opacity-75 mb-5 mx-auto" style={{ maxWidth: '560px' }}>
            Join hundreds of happy clients who trusted EventHive to make their special day
            extraordinary. Book your consultation today — it's completely free.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link
              to="/book"
              className="btn btn-warning btn-lg fw-bold px-5 rounded-pill shadow"
              style={{ color: '#1a0533' }}
            >
              <i className="bi bi-calendar-plus me-2"></i>
              Book Your Event
            </Link>
            <Link to="/contact" className="btn btn-outline-light btn-lg px-5 rounded-pill">
              <i className="bi bi-chat me-2"></i>
              Talk to Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
