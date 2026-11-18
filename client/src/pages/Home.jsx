import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPackages } from '../services/packageService';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';

const steps = [
  {
    number: '01',
    icon: 'bi-grid-1x2',
    title: 'Find the right package',
    description:
      'Browse event packages by occasion and budget. Each package gives you a clear starting point for planning.',
  },
  {
    number: '02',
    icon: 'bi-calendar-check',
    title: 'Share your event details',
    description:
      'Choose a date, tell us what you have in mind, and send your booking request. Our team will get back to you.',
  },
  {
    number: '03',
    icon: 'bi-balloon-heart',
    title: 'Enjoy your celebration',
    description:
      'We coordinate the details so you can spend less time managing arrangements and more time with your guests.',
  },
];

const testimonials = [
  {
    name: 'Sneha & Arjun Kapoor',
    event: 'Wedding Reception',
    initials: 'SA',
    quote:
      "EventHive turned our dream wedding into reality. Every detail was thoughtfully handled, from the floral arrangements to the live music. We couldn't have asked for a better evening.",
  },
  {
    name: 'Ramesh Agarwal',
    event: 'Corporate Annual Day',
    initials: 'RA',
    quote:
      'The team was professional, organised, and easy to work with. Our 200-person corporate event ran smoothly, and the planning process was clear from start to finish.',
  },
  {
    name: 'Pooja Sharma',
    event: "Daughter's Birthday",
    initials: 'PS',
    quote:
      "My daughter's seventh birthday was wonderful. The decorations, cake, and entertainment came together beautifully, and she had a day she won't forget.",
  },
];

const categories = [
  { icon: 'bi-balloon-heart', label: 'Birthdays', detail: 'Fun, personal celebrations' },
  { icon: 'bi-gem', label: 'Weddings', detail: 'Your day, thoughtfully planned' },
  { icon: 'bi-briefcase', label: 'Corporate', detail: 'Events that bring teams together' },
  { icon: 'bi-heart', label: 'Anniversaries', detail: 'Meaningful moments, made special' },
];

const stats = [
  { value: '500+', label: 'Events organised' },
  { value: '1,000+', label: 'Happy clients' },
  { value: '10+', label: 'Years of experience' },
];

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
    <main className="event-home">
      {/* Hero */}
      <section className="event-hero">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="event-eyebrow">
                <i className="bi bi-geo-alt me-2" aria-hidden="true" />
                Event planning in Mathura
              </span>

              <h1 className="event-hero-title">
                Make room for
                <span> moments that matter.</span>
              </h1>

              <p className="event-hero-copy">
                From birthdays and anniversaries to weddings and corporate gatherings,
                EventHive helps you plan a celebration that feels like yours.
              </p>

              <div className="d-flex flex-wrap gap-3 align-items-center">
                <Link to="/packages" className="btn event-btn-primary btn-lg">
                  Explore packages <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
                </Link>
                <Link to="/book" className="btn event-btn-outline btn-lg">
                  Plan your event
                </Link>
                {!user ? (
                  <Link to="/login" className="btn event-btn-outline-dark btn-lg">
                    <i className="bi bi-box-arrow-in-right me-2" aria-hidden="true" />
                    Login
                  </Link>
                ) : (
                  <Link
                    to={user.role === 'admin' ? '/admin' : '/my-bookings'}
                    className="btn event-btn-outline-dark btn-lg"
                  >
                    <i className="bi bi-person-circle me-2" aria-hidden="true" />
                    {user.role === 'admin' ? 'Admin Portal' : 'My Reservations'}
                  </Link>
                )}
              </div>

              <div className="event-stats" aria-label="EventHive at a glance">
                {stats.map((stat) => (
                  <div className="event-stat" key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-5">
              <div className="event-category-panel">
                <div className="mb-3">
                  <p className="event-panel-kicker mb-1">A celebration for every occasion</p>
                  <h2 className="h4 fw-bold mb-0">What are you planning?</h2>
                </div>
                <div className="row g-3">
                  {categories.map((category) => (
                    <div className="col-6" key={category.label}>
                      <Link to="/packages" className="event-category">
                        <span className="event-category-icon">
                          <i className={`bi ${category.icon}`} aria-hidden="true" />
                        </span>
                        <strong>{category.label}</strong>
                        <small>{category.detail}</small>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured packages */}
      <section className="event-section" id="featured-packages">
        <div className="container">
          <div className="event-section-heading">
            <div>
              <span className="event-kicker">A good place to start</span>
              <h2>Explore our featured packages</h2>
              <p>
                Take a look at some of our popular options. Find one you like, then
                personalise the details for your event.
              </p>
            </div>
            <Link to="/packages" className="event-text-link">
              See all packages <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
            </Link>
          </div>

          {loading ? (
            <div className="py-5 text-center">
              <Loader />
            </div>
          ) : featuredPackages.length === 0 ? (
            <div className="event-empty-state">
              <i className="bi bi-calendar2-event" aria-hidden="true" />
              <h3>No featured packages right now</h3>
              <p>Browse all available packages to find an option for your celebration.</p>
              <Link to="/packages" className="btn event-btn-primary">
                Browse all packages
              </Link>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {featuredPackages.map((pkg) => (
                  <div key={pkg._id} className="col-md-6 col-lg-4">
                    <article className="card event-package-card h-100">
                      <div className="event-package-image">
                        {pkg.images?.[0] ? (
                          <img
                            src={pkg.images[0]}
                            alt={pkg.title || pkg.name || 'Event package'}
                            loading="lazy"
                          />
                        ) : (
                          <div className="event-image-placeholder">
                            <i className="bi bi-image" aria-hidden="true" />
                            <span>Package image coming soon</span>
                          </div>
                        )}
                        {pkg.category && (
                          <span className="event-package-category">{pkg.category}</span>
                        )}
                      </div>

                      <div className="card-body d-flex flex-column p-4">
                        <h3 className="event-package-title">{pkg.title || pkg.name}</h3>
                        <p className="event-package-description">
                          {pkg.shortDescription || pkg.description?.slice(0, 115) ||
                            'A thoughtfully prepared package to help you get your event started.'}
                          {!pkg.shortDescription && pkg.description?.length > 115 ? '…' : ''}
                        </p>

                        <div className="event-package-meta mt-auto">
                          {pkg.price ? (
                            <div>
                              <small>Starting from</small>
                              <strong>₹{pkg.price.toLocaleString('en-IN')}</strong>
                            </div>
                          ) : (
                            <div>
                              <small>Pricing</small>
                              <strong>Ask for details</strong>
                            </div>
                          )}
                          {pkg.capacity && (
                            <span>
                              <i className="bi bi-people me-1" aria-hidden="true" />
                              Up to {pkg.capacity} guests
                            </span>
                          )}
                        </div>

                        <Link to={`/packages/${pkg._id}`} className="btn event-btn-card w-100 mt-3">
                          View package details
                          <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
                        </Link>
                      </div>
                    </article>
                  </div>
                ))}
              </div>

              <div className="text-center mt-4">
                <Link to="/packages" className="btn event-btn-outline-dark">
                  View all packages
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="event-section event-section-soft">
        <div className="container">
          <div className="event-centered-heading">
            <span className="event-kicker">Clear from the start</span>
            <h2>Planning your event is simple</h2>
            <p>Three straightforward steps take you from an idea to a day worth remembering.</p>
          </div>

          <div className="row g-4">
            {steps.map((step) => (
              <div className="col-md-4" key={step.number}>
                <article className="event-step-card h-100">
                  <div className="event-step-top">
                    <span className="event-step-icon">
                      <i className={`bi ${step.icon}`} aria-hidden="true" />
                    </span>
                    <span className="event-step-number">{step.number}</span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="event-section">
        <div className="container">
          <div className="event-section-heading">
            <div>
              <span className="event-kicker">Kind words from our clients</span>
              <h2>Good memories. Real experiences.</h2>
              <p>Here is what clients have shared about their EventHive celebrations.</p>
            </div>
          </div>

          <div className="row g-4">
            {testimonials.map((testimonial) => (
              <div className="col-md-4" key={testimonial.name}>
                <article className="event-testimonial h-100">
                  <div className="event-stars" aria-label={`${testimonial.rating || 5} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <i className="bi bi-star-fill" key={index} aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote>“{testimonial.quote}”</blockquote>
                  <div className="event-reviewer">
                    <span className="event-reviewer-avatar">{testimonial.initials}</span>
                    <span>
                      <strong>{testimonial.name}</strong>
                      <small>{testimonial.event}</small>
                    </span>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final call to action */}
      <section className="event-final-cta">
        <div className="container">
          <div className="event-cta-content">
            <span className="event-kicker">Let's make it happen</span>
            <h2>Have a date in mind?</h2>
            <p>
              Tell us what you are celebrating and what you need. We will help you work
              out the next steps.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/book" className="btn event-btn-primary btn-lg">
                Start planning <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
              </Link>
              <Link to="/contact" className="btn event-btn-outline btn-lg">
                Contact our team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .event-home {
          --event-ink: #202b3c;
          --event-muted: #667085;
          --event-primary: #2457a6;
          --event-primary-dark: #193f7c;
          --event-border: #e4e8ef;
          color: var(--event-ink);
          background: #ffffff;
        }

        .event-home .event-hero {
          display: flex;
          align-items: center;
          min-height: 620px;
          background: #f4f6f9;
          border-bottom: 1px solid var(--event-border);
        }

        .event-eyebrow,
        .event-kicker {
          display: inline-flex;
          align-items: center;
          color: var(--event-primary);
          font-size: .78rem;
          font-weight: 700;
          letter-spacing: .09em;
          line-height: 1.4;
          text-transform: uppercase;
        }

        .event-eyebrow {
          padding: .55rem .8rem;
          margin-bottom: 1.5rem;
          border: 1px solid #d7e1f0;
          border-radius: 999px;
          background: #ffffff;
          letter-spacing: .035em;
          text-transform: none;
        }

        .event-hero-title {
          max-width: 680px;
          margin: 0 0 1.25rem;
          color: var(--event-ink);
          font-size: clamp(2.7rem, 5vw, 4.5rem);
          font-weight: 800;
          letter-spacing: -.055em;
          line-height: 1.06;
        }

        .event-hero-title span {
          display: block;
          color: var(--event-primary);
        }

        .event-hero-copy {
          max-width: 570px;
          margin-bottom: 2rem;
          color: var(--event-muted);
          font-size: 1.12rem;
          line-height: 1.8;
        }

        .event-btn-primary,
        .event-btn-outline,
        .event-btn-outline-dark,
        .event-btn-card {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: .75rem 1.25rem;
          border-radius: 8px;
          font-weight: 700;
          transition: background-color .18s ease, border-color .18s ease, color .18s ease;
        }

        .event-btn-primary {
          color: #ffffff;
          border: 1px solid var(--event-primary);
          background: var(--event-primary);
        }

        .event-btn-primary:hover,
        .event-btn-primary:focus {
          color: #ffffff;
          border-color: var(--event-primary-dark);
          background: var(--event-primary-dark);
        }

        .event-btn-outline {
          color: var(--event-primary);
          border: 1px solid #b9c8dc;
          background: #ffffff;
        }

        .event-btn-outline:hover,
        .event-btn-outline:focus {
          color: var(--event-primary-dark);
          border-color: var(--event-primary);
          background: #f7f9fc;
        }

        .event-btn-outline-dark {
          color: var(--event-ink);
          border: 1px solid #cbd2dc;
          background: #ffffff;
        }

        .event-btn-outline-dark:hover,
        .event-btn-outline-dark:focus,
        .event-btn-card:hover,
        .event-btn-card:focus {
          color: var(--event-primary-dark);
          border-color: var(--event-primary);
          background: #f4f7fb;
        }

        .event-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          margin-top: 3rem;
          padding-top: 1.5rem;
          border-top: 1px solid #dce2eb;
        }

        .event-stat {
          display: flex;
          flex-direction: column;
          gap: .2rem;
        }

        .event-stat strong {
          color: var(--event-ink);
          font-size: 1.55rem;
          line-height: 1.2;
        }

        .event-stat span {
          color: var(--event-muted);
          font-size: .84rem;
        }

        .event-category-panel {
          padding: 1.5rem;
          border: 1px solid var(--event-border);
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 12px 32px rgba(32, 43, 60, .06);
        }

        .event-panel-kicker {
          color: var(--event-muted);
          font-size: .82rem;
        }

        .event-category {
          display: flex;
          min-height: 150px;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 1rem;
          border: 1px solid var(--event-border);
          border-radius: 10px;
          color: var(--event-ink);
          text-decoration: none;
          transition: border-color .18s ease, background-color .18s ease;
        }

        .event-category:hover {
          border-color: #a9bdd8;
          background: #f7f9fc;
          color: var(--event-primary);
        }

        .event-category-icon {
          display: grid;
          width: 38px;
          height: 38px;
          margin-bottom: .75rem;
          place-items: center;
          border-radius: 9px;
          color: var(--event-primary);
          background: #edf2f9;
          font-size: 1.2rem;
        }

        .event-category strong {
          margin-bottom: .2rem;
          font-size: .95rem;
        }

        .event-category small {
          color: var(--event-muted);
          font-size: .75rem;
          line-height: 1.4;
        }

        .event-section {
          padding: 5.25rem 0;
          background: #ffffff;
        }

        .event-section-soft {
          background: #f4f6f9;
        }

        .event-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .event-section-heading h2,
        .event-centered-heading h2 {
          margin: .55rem 0 .65rem;
          color: var(--event-ink);
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 800;
          letter-spacing: -.035em;
        }

        .event-section-heading p,
        .event-centered-heading p {
          max-width: 620px;
          margin: 0;
          color: var(--event-muted);
          line-height: 1.7;
        }

        .event-text-link {
          flex-shrink: 0;
          padding-bottom: .3rem;
          color: var(--event-primary);
          font-weight: 700;
          text-decoration: none;
        }

        .event-text-link:hover {
          color: var(--event-primary-dark);
          text-decoration: underline;
        }

        .event-package-card {
          overflow: hidden;
          border: 1px solid var(--event-border);
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 4px 16px rgba(32, 43, 60, .045);
          transition: transform .18s ease, box-shadow .18s ease;
        }

        .event-package-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(32, 43, 60, .09);
        }

        .event-package-image {
          position: relative;
          height: 210px;
          overflow: hidden;
          background: #edf1f6;
        }

        .event-package-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .event-image-placeholder {
          display: flex;
          width: 100%;
          height: 100%;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: .5rem;
          color: #7b8798;
        }

        .event-image-placeholder i {
          font-size: 2rem;
        }

        .event-image-placeholder span {
          font-size: .8rem;
        }

        .event-package-category {
          position: absolute;
          top: 1rem;
          left: 1rem;
          padding: .35rem .65rem;
          border-radius: 5px;
          color: var(--event-primary-dark);
          background: #ffffff;
          font-size: .75rem;
          font-weight: 700;
        }

        .event-package-title {
          margin-bottom: .6rem;
          color: var(--event-ink);
          font-size: 1.12rem;
          font-weight: 750;
        }

        .event-package-description {
          min-height: 4.4rem;
          margin-bottom: 1.2rem;
          color: var(--event-muted);
          font-size: .9rem;
          line-height: 1.65;
        }

        .event-package-meta {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: .75rem;
          padding-top: 1rem;
          border-top: 1px solid var(--event-border);
        }

        .event-package-meta div {
          display: flex;
          flex-direction: column;
          gap: .15rem;
        }

        .event-package-meta small {
          color: var(--event-muted);
          font-size: .75rem;
        }

        .event-package-meta strong {
          color: var(--event-primary);
          font-size: 1.15rem;
        }

        .event-package-meta > span {
          color: var(--event-muted);
          font-size: .78rem;
          white-space: nowrap;
        }

        .event-btn-card {
          color: var(--event-primary);
          border: 1px solid #c5d2e2;
          background: #ffffff;
        }

        .event-empty-state {
          padding: 3rem 1rem;
          border: 1px dashed #cbd2dc;
          border-radius: 12px;
          text-align: center;
        }

        .event-empty-state > i {
          color: var(--event-primary);
          font-size: 2rem;
        }

        .event-empty-state h3 {
          margin: .8rem 0 .4rem;
          font-size: 1.2rem;
          font-weight: 750;
        }

        .event-empty-state p {
          color: var(--event-muted);
        }

        .event-centered-heading {
          max-width: 680px;
          margin: 0 auto 2.25rem;
          text-align: center;
        }

        .event-centered-heading p {
          margin: 0 auto;
        }

        .event-step-card {
          padding: 1.75rem;
          border: 1px solid var(--event-border);
          border-radius: 12px;
          background: #ffffff;
        }

        .event-step-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .event-step-icon {
          display: grid;
          width: 52px;
          height: 52px;
          place-items: center;
          border-radius: 10px;
          color: var(--event-primary);
          background: #edf2f9;
          font-size: 1.4rem;
        }

        .event-step-number {
          color: #a5afbd;
          font-size: 1.1rem;
          font-weight: 800;
        }

        .event-step-card h3 {
          margin-bottom: .65rem;
          font-size: 1.12rem;
          font-weight: 750;
        }

        .event-step-card p {
          margin: 0;
          color: var(--event-muted);
          font-size: .92rem;
          line-height: 1.7;
        }

        .event-testimonial {
          display: flex;
          flex-direction: column;
          padding: 1.6rem;
          border: 1px solid var(--event-border);
          border-radius: 12px;
          background: #ffffff;
        }

        .event-stars {
          display: flex;
          gap: .25rem;
          margin-bottom: 1rem;
          color: #b7791f;
          font-size: .85rem;
        }

        .event-testimonial blockquote {
          flex: 1;
          margin: 0 0 1.5rem;
          color: #475467;
          font-size: .94rem;
          line-height: 1.75;
        }

        .event-reviewer {
          display: flex;
          align-items: center;
          gap: .8rem;
          padding-top: 1rem;
          border-top: 1px solid var(--event-border);
        }

        .event-reviewer-avatar {
          display: grid;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          place-items: center;
          border-radius: 50%;
          color: var(--event-primary-dark);
          background: #edf2f9;
          font-size: .82rem;
          font-weight: 800;
        }

        .event-reviewer span:last-child {
          display: flex;
          flex-direction: column;
          gap: .15rem;
        }

        .event-reviewer strong {
          color: var(--event-ink);
          font-size: .86rem;
        }

        .event-reviewer small {
          color: var(--event-muted);
          font-size: .78rem;
        }

        .event-final-cta {
          padding: 4.5rem 0;
          border-top: 1px solid var(--event-border);
          background: #f4f6f9;
        }

        .event-cta-content {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
        }

        .event-cta-content h2 {
          margin: .65rem 0;
          color: var(--event-ink);
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -.04em;
        }

        .event-cta-content p {
          max-width: 570px;
          margin: 0 auto 1.75rem;
          color: var(--event-muted);
          line-height: 1.75;
        }

        @media (max-width: 991.98px) {
          .event-home .event-hero {
            min-height: auto;
          }

          .event-category-panel {
            max-width: 620px;
          }
        }

        @media (max-width: 767.98px) {
          .event-section {
            padding: 3.75rem 0;
          }

          .event-section-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: .8rem;
          }

          .event-hero-title {
            font-size: clamp(2.5rem, 11vw, 3.6rem);
          }

          .event-stats {
            gap: 1.25rem;
          }

          .event-stat strong {
            font-size: 1.3rem;
          }

          .event-category {
            min-height: 135px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .event-home *,
          .event-home *::before,
          .event-home *::after {
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
