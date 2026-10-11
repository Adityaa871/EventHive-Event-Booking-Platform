import { Link } from 'react-router-dom';

export default function About() {
  const values = [
    {
      icon: 'bi-lightbulb-fill',
      title: 'Creativity',
      color: 'warning',
      description:
        'We craft unique, imaginative experiences tailored to your vision. No two events are the same — every celebration tells its own story.',
    },
    {
      icon: 'bi-shield-check',
      title: 'Reliability',
      color: 'success',
      description:
        'From planning to execution, we deliver on every promise. Our clients trust us because we show up — prepared, on time, and exceeding expectations.',
    },
    {
      icon: 'bi-trophy-fill',
      title: 'Excellence',
      color: 'primary',
      description:
        'We never settle for ordinary. Every detail is refined until it meets our highest standards, ensuring your event is flawlessly executed.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Events Executed', icon: 'bi-calendar-event' },
    { number: '1000+', label: 'Happy Clients', icon: 'bi-emoji-smile' },
    { number: '10+', label: 'Years of Experience', icon: 'bi-award' },
    { number: '50+', label: 'Expert Team Members', icon: 'bi-people' },
  ];

  const team = [
    {
      name: 'Priya Sharma',
      role: 'Founder & Creative Director',
      initials: 'PS',
      color: 'primary',
      bio: 'With over a decade in event management, Priya founded EventHive to bring world-class celebrations to every doorstep.',
    },
    {
      name: 'Rahul Verma',
      role: 'Head of Operations',
      initials: 'RV',
      color: 'success',
      bio: 'Rahul ensures every logistics detail is airtight, coordinating vendors, venues, and timelines with military precision.',
    },
    {
      name: 'Ananya Gupta',
      role: 'Lead Event Designer',
      initials: 'AG',
      color: 'warning',
      bio: "Ananya transforms spaces into dreamscapes, bringing clients' visions to life through stunning décor and design.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section
        className="py-5 text-white text-center"
        style={{
          background: 'linear-gradient(135deg, #6f42c1 0%, #0d6efd 100%)',
          minHeight: '340px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container py-4">
          <span className="badge bg-white text-primary fw-semibold mb-3 px-3 py-2 fs-6">
            Our Story
          </span>
          <h1 className="display-4 fw-bold mb-3">About EventHive</h1>
          <p className="lead mb-0 mx-auto" style={{ maxWidth: '620px' }}>
            We are a passionate team of event planners, designers, and coordinators dedicated to
            turning your most important moments into lasting memories.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge bg-primary-subtle text-primary fw-semibold mb-3 px-3 py-2">
                Our Mission
              </span>
              <h2 className="display-6 fw-bold mb-4">
                Making Every Celebration Unforgettable
              </h2>
              <p className="text-muted fs-5 mb-4">
                At EventHive, our mission is simple: to take the stress out of event planning and
                replace it with joy. We believe every milestone deserves a celebration that reflects
                the people involved — personal, meaningful, and extraordinary.
              </p>
              <p className="text-muted fs-5">
                Founded in Mathura, UP, we started as a small team with a big dream — to become the
                most trusted event planning partner in the region. Today, we've grown into a
                full-service event management company serving clients across India.
              </p>
            </div>
            <div className="col-lg-6">
              <div
                className="rounded-4 d-flex align-items-center justify-content-center text-center p-5"
                style={{
                  background: 'linear-gradient(135deg, #e8f4fd 0%, #f3e8ff 100%)',
                  minHeight: '380px',
                }}
              >
                <div>
                  <i
                    className="bi bi-balloon-heart-fill text-primary"
                    style={{ fontSize: '5rem' }}
                  ></i>
                  <h4 className="mt-4 fw-bold text-dark">Every Event, A Masterpiece</h4>
                  <p className="text-muted">
                    We pour heart, creativity, and expertise into every celebration we design.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #0d6efd, #6f42c1)' }}>
        <div className="container">
          <div className="row g-4 text-white text-center">
            {stats.map((stat, i) => (
              <div key={i} className="col-6 col-lg-3">
                <div className="p-4">
                  <i className={`bi ${stat.icon} fs-1 mb-3 opacity-75`}></i>
                  <div className="display-5 fw-bold">{stat.number}</div>
                  <div className="opacity-75 mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-primary-subtle text-primary fw-semibold mb-3 px-3 py-2">
              What We Stand For
            </span>
            <h2 className="display-6 fw-bold">Our Core Values</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '520px' }}>
              These principles guide every decision we make and every event we design.
            </p>
          </div>
          <div className="row g-4 justify-content-center">
            {values.map((v, i) => (
              <div key={i} className="col-md-4">
                <div className="card border-0 shadow-sm h-100 text-center p-4 rounded-4">
                  <div
                    className={`rounded-circle bg-${v.color} bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-4`}
                    style={{ width: '80px', height: '80px' }}
                  >
                    <i className={`bi ${v.icon} text-${v.color} fs-2`}></i>
                  </div>
                  <h4 className="fw-bold mb-3">{v.title}</h4>
                  <p className="text-muted mb-0">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-primary-subtle text-primary fw-semibold mb-3 px-3 py-2">
              Meet the Team
            </span>
            <h2 className="display-6 fw-bold">The People Behind the Magic</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '520px' }}>
              A diverse, passionate team united by one goal: your perfect event.
            </p>
          </div>
          <div className="row g-4 justify-content-center">
            {team.map((member, i) => (
              <div key={i} className="col-md-4">
                <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                  <div
                    className={`bg-${member.color} bg-opacity-10 d-flex align-items-center justify-content-center py-5`}
                  >
                    <div
                      className={`rounded-circle bg-${member.color} d-flex align-items-center justify-content-center text-white fw-bold`}
                      style={{ width: '90px', height: '90px', fontSize: '2rem' }}
                    >
                      {member.initials}
                    </div>
                  </div>
                  <div className="card-body text-center p-4">
                    <h5 className="fw-bold mb-1">{member.name}</h5>
                    <span className={`badge bg-${member.color}-subtle text-${member.color} mb-3`}>
                      {member.role}
                    </span>
                    <p className="text-muted small mb-0">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 bg-primary text-white text-center">
        <div className="container py-3">
          <h2 className="display-6 fw-bold mb-3">Ready to Plan Your Event?</h2>
          <p className="lead mb-4 opacity-75">
            Let's create something extraordinary together.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/book" className="btn btn-light btn-lg fw-semibold px-5 rounded-pill">
              Book Now
            </Link>
            <Link to="/contact" className="btn btn-outline-light btn-lg px-5 rounded-pill">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
