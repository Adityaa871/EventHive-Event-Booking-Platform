import { useState } from 'react';

const contactInfo = [
  {
    icon: 'bi-geo-alt',
    title: 'Planning Office',
    lines: ['EventHive Operations Studio', 'Near Vishram Ghat, Mathura', 'Uttar Pradesh 281001, India'],
  },
  {
    icon: 'bi-telephone',
    title: 'Direct Telephony',
    lines: ['+91 98765 43210 (Direct)', '+91 87654 32109 (Inquiries)'],
  },
  {
    icon: 'bi-envelope',
    title: 'Electronic Correspondence',
    lines: ['hello@eventhive.in', 'bookings@eventhive.in'],
  },
  {
    icon: 'bi-clock',
    title: 'Consultation Hours',
    lines: ['Monday – Saturday: 9:00 AM – 7:00 PM', 'Sunday: By scheduled appointment'],
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="reveal-fade-up">
      {/* ── Page Header ── */}
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
            <span>Connect</span>
            <span>•</span>
            <span>Customer Service</span>
          </div>
          <h1 className="h1 fw-bold mb-3">Contact EventHive</h1>
          <p className="lead text-secondary mb-0" style={{ maxWidth: '580px', fontSize: '1.1rem', lineHeight: 1.75 }}>
            Have questions about package customizations, venue availability, or dates? Reach out directly and an event coordinator will respond promptly.
          </p>
        </div>
      </section>

      {/* ── Contact Info Cards ── */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-canvas)' }}>
        <div className="container">
          <div className="row g-4">
            {contactInfo.map((item, i) => (
              <div key={i} className="col-sm-6 col-lg-3">
                <div
                  className="p-4 h-100 card-tactile"
                  style={{ backgroundColor: 'var(--bg-surface)' }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center text-dark mb-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <i className={`bi ${item.icon}`} style={{ fontSize: '1.1rem' }} aria-hidden="true" />
                  </div>
                  <h3 className="h6 fw-bold mb-2">{item.title}</h3>
                  {item.lines.map((line, j) => (
                    <div key={j} className="text-secondary small mb-1">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Map Placeholder & Form Split ── */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="row g-5">
            {/* Left: Location & Details */}
            <div className="col-lg-5">
              <span className="text-uppercase small fw-bold text-muted mb-2 d-block" style={{ letterSpacing: '0.06em' }}>
                Visit Our Studio
              </span>
              <h2 className="h4 fw-bold mb-3">Mathura Headquarters</h2>
              <p className="text-secondary mb-4" style={{ lineHeight: 1.7 }}>
                We welcome prospective clients for in-person planning sessions and venue consultations. Drop by our office or call ahead to book dedicated time.
              </p>

              <div
                className="p-4 card-tactile d-flex flex-column align-items-center justify-content-center text-center mb-4"
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  minHeight: '260px',
                }}
              >
                <i className="bi bi-geo-alt fs-2 text-dark mb-2" aria-hidden="true" />
                <div className="fw-bold text-dark">EventHive Studio</div>
                <div className="small text-muted mb-3">Vishram Ghat Area, Mathura, UP 281001</div>
                <a
                  href="https://maps.google.com/?q=Mathura,UP"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary btn-sm btn-tactile"
                >
                  Open in Google Maps
                  <i className="bi bi-arrow-up-right ms-2" aria-hidden="true" />
                </a>
              </div>

              <div className="pt-2">
                <div className="small fw-bold text-uppercase text-muted mb-2" style={{ letterSpacing: '0.06em' }}>
                  Emergency Contact
                </div>
                <p className="small text-secondary mb-0">
                  For active event day logistics or vendor queries: <strong className="text-dark">+91 98765 43210</strong>
                </p>
              </div>
            </div>

            {/* Right: Message Form */}
            <div className="col-lg-7">
              <div
                className="p-4 p-md-5 card-tactile"
                style={{ backgroundColor: 'var(--bg-surface)' }}
              >
                <h2 className="h4 fw-bold mb-1">Send a message</h2>
                <p className="text-muted small mb-4">
                  For inquiries not requiring a formal booking contract, write to our team directly.
                </p>

                {submitted ? (
                  <div
                    className="p-4 text-center rounded-2"
                    style={{
                      backgroundColor: 'var(--status-confirmed-bg)',
                      border: '1px solid var(--status-confirmed-border)',
                      color: 'var(--status-confirmed-text)',
                    }}
                  >
                    <i className="bi bi-check-circle fs-3 d-block mb-2" aria-hidden="true" />
                    <h3 className="h6 fw-bold mb-1">Message received</h3>
                    <p className="small mb-3">Thank you for getting in touch. We will reply within one business day.</p>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm btn-tactile"
                      onClick={() => {
                        setForm({ name: '', email: '', subject: '', message: '' });
                        setSubmitted(false);
                      }}
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="contact-name" className="form-label">
                          Full Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          id="contact-name"
                          name="name"
                          className="form-control"
                          placeholder="Your name"
                          value={form.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="contact-email" className="form-label">
                          Email Address <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          id="contact-email"
                          name="email"
                          className="form-control"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label htmlFor="contact-subject" className="form-label">
                          Subject Line
                        </label>
                        <input
                          type="text"
                          id="contact-subject"
                          name="subject"
                          className="form-control"
                          placeholder="e.g. Inquiring about November wedding dates"
                          value={form.subject}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-12">
                        <label htmlFor="contact-message" className="form-label">
                          Message <span className="text-danger">*</span>
                        </label>
                        <textarea
                          id="contact-message"
                          name="message"
                          className="form-control"
                          rows={5}
                          placeholder="Please describe your event ideas, approximate guest counts, or specific questions..."
                          value={form.message}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        className="btn btn-primary btn-tactile btn-lg w-100"
                      >
                        Send message
                        <i className="bi bi-arrow-right ms-2 icon-nudge" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="text-center text-muted small mt-3">
                      <span>We treat your information confidentially and never share client data with third parties.</span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
