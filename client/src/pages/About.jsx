import { Link } from 'react-router-dom';

export default function About() {
  const values = [
    {
      title: 'Reliability under pressure',
      description:
        'Live events allow no second takes. We construct meticulous run-of-shows, verify vendor timings, and ensure backup plans are active hours before guests arrive.',
    },
    {
      title: 'Transparent production',
      description:
        'No surprise markups or mysterious vendor invoices. We itemize logistics, stage builds, and decor specs upfront so clients maintain complete budgetary control.',
    },
    {
      title: 'Contextual design',
      description:
        'Every wedding, milestone birthday, and corporate offsite should reflect the people in the room, not a generic mass-market template.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Events executed' },
    { number: '1,000+', label: 'Clients hosted' },
    { number: '10+', label: 'Years operating' },
    { number: '50+', label: 'Vetted vendor partners' },
  ];

  const team = [
    {
      name: 'Priya Sharma',
      role: 'Founder & Production Director',
      bio: 'Over a decade directing large-scale family celebrations and weddings across Western Uttar Pradesh and Delhi NCR.',
    },
    {
      name: 'Rahul Verma',
      role: 'Head of Logistics & Staging',
      bio: 'Coordinates power distribution, staging structures, acoustic setups, and timeline enforcement on event day.',
    },
    {
      name: 'Ananya Gupta',
      role: 'Lead Floral & Ambient Designer',
      bio: 'Specializes in spatial transformation, botanical styling, and atmospheric lighting for intimate and grand venues.',
    },
  ];

  return (
    <div className="reveal-fade-up">
      {/* ── 1. Page Header ── */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          paddingTop: '64px',
          paddingBottom: '64px',
        }}
      >
        <div className="container">
          <div className="d-inline-flex align-items-center gap-2 mb-2 text-muted small text-uppercase fw-semibold" style={{ letterSpacing: '0.06em' }}>
            <span>Company Profile</span>
            <span>•</span>
            <span>Mathura, India</span>
          </div>
          <h1 className="h1 fw-bold mb-3" style={{ maxWidth: '640px' }}>
            Event coordination built on rigor and calm execution.
          </h1>
          <p className="lead text-secondary mb-0" style={{ maxWidth: '600px', fontSize: '1.1rem', lineHeight: 1.75 }}>
            We started EventHive to eliminate the anxiety and fragmentation of hiring unvetted event suppliers. Today, we manage full-cycle celebrations with disciplined timelines.
          </p>
        </div>
      </section>

      {/* ── 2. Narrative & Mission ── */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-canvas)' }}>
        <div className="container py-3">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <span className="text-uppercase small fw-bold text-muted mb-2 d-block" style={{ letterSpacing: '0.06em' }}>
                Our Foundation
              </span>
              <h2 className="h3 fw-bold mb-4">
                Replacing last-minute panic with methodical planning.
              </h2>
              <p className="text-secondary mb-3" style={{ lineHeight: 1.75 }}>
                In traditional event planning, clients often find themselves stuck mediating between caterers, decorators, sound engineers, and venue managers on the morning of their own wedding or celebration.
              </p>
              <p className="text-secondary mb-0" style={{ lineHeight: 1.75 }}>
                EventHive serves as your single accountable partner. We handle contract negotiation, site walk-throughs, acoustic checks, and day-of execution so your family and guests can simply enjoy the moment.
              </p>
            </div>

            <div className="col-lg-6">
              <div
                className="p-4 p-md-5 card-tactile"
                style={{ backgroundColor: 'var(--bg-surface)' }}
              >
                <h3 className="h5 fw-bold mb-3">Our Core Guarantee</h3>
                <p className="small text-muted mb-4" style={{ lineHeight: 1.7 }}>
                  We commit to complete transparency: all vendor invoices, decor specs, and scheduling milestones are documented and visible to you from day one.
                </p>
                <div className="d-flex align-items-center gap-3 pt-3 border-top">
                  <i className="bi bi-shield-check fs-4 text-dark" aria-hidden="true" />
                  <div className="small">
                    <strong className="d-block text-dark">Dedicated Day-of Producer</strong>
                    <span className="text-muted">Onsite 4 hours prior to guest arrival.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Performance Metrics ── */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '48px 0',
        }}
      >
        <div className="container">
          <div className="row g-4 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="col-6 col-lg-3">
                <div className="py-2">
                  <div className="display-6 fw-bold text-dark mb-1" style={{ letterSpacing: '-0.03em' }}>
                    {stat.number}
                  </div>
                  <div className="small text-muted">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Core Values ── */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-canvas)' }}>
        <div className="container py-4">
          <div className="mb-5" style={{ maxWidth: '580px' }}>
            <span className="text-uppercase small fw-bold text-muted mb-2 d-block" style={{ letterSpacing: '0.06em' }}>
              Guiding Principles
            </span>
            <h2 className="h3 fw-bold">How we approach every assignment</h2>
          </div>

          <div className="row g-4">
            {values.map((v, i) => (
              <div key={i} className="col-md-4">
                <div
                  className="p-4 h-100 card-tactile"
                  style={{ backgroundColor: 'var(--bg-surface)' }}
                >
                  <div className="fw-bold small text-muted mb-3">0{i + 1}</div>
                  <h3 className="h6 fw-bold mb-2">{v.title}</h3>
                  <p className="small text-muted mb-0" style={{ lineHeight: 1.7 }}>
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Team ── */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container py-4">
          <div className="mb-5" style={{ maxWidth: '580px' }}>
            <span className="text-uppercase small fw-bold text-muted mb-2 d-block" style={{ letterSpacing: '0.06em' }}>
              Leadership
            </span>
            <h2 className="h3 fw-bold">Meet our event directors</h2>
          </div>

          <div className="row g-4">
            {team.map((member, i) => (
              <div key={i} className="col-md-4">
                <div
                  className="p-4 h-100 card-tactile"
                  style={{ backgroundColor: 'var(--bg-canvas)' }}
                >
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center fw-bold text-dark"
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '14px',
                      }}
                    >
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="h6 fw-bold mb-0">{member.name}</h3>
                      <div className="small text-muted">{member.role}</div>
                    </div>
                  </div>
                  <p className="small text-secondary mb-0" style={{ lineHeight: 1.7 }}>
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Bottom Banner ── */}
      <section
        style={{
          backgroundColor: 'var(--brand-primary)',
          color: '#ffffff',
          padding: '64px 0',
        }}
      >
        <div className="container text-center">
          <div style={{ maxWidth: '580px', margin: '0 auto' }}>
            <h2 className="h3 fw-bold text-white mb-3">Plan your upcoming event with us</h2>
            <p className="text-white-50 mb-4" style={{ lineHeight: 1.7 }}>
              Schedule an initial consultation to review dates, venue layouts, and custom packages.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link
                to="/book"
                className="btn btn-tactile"
                style={{
                  backgroundColor: '#ffffff',
                  color: 'var(--brand-primary)',
                  fontWeight: 700,
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
                  padding: '10px 20px',
                }}
              >
                Contact office
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
