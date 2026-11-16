import { useState } from 'react';

const contactInfo = [
  {
    icon: 'bi-geo-alt-fill',
    title: 'Our Address',
    color: 'primary',
    lines: ['EventHive HQ', 'Near Vishram Ghat, Mathura', 'Uttar Pradesh — 281 001'],
  },
  {
    icon: 'bi-telephone-fill',
    title: 'Phone',
    color: 'success',
    lines: ['+91 98765 43210', '+91 87654 32109'],
  },
  {
    icon: 'bi-envelope-fill',
    title: 'Email',
    color: 'warning',
    lines: ['hello@eventhive.in', 'support@eventhive.in'],
  },
  {
    icon: 'bi-clock-fill',
    title: 'Business Hours',
    color: 'info',
    lines: ['Monday – Saturday: 9 AM – 7 PM', 'Sunday: 10 AM – 4 PM'],
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {/* Hero */}
      <section
        className="py-5 text-white text-center"
        style={{
          background: 'linear-gradient(135deg, #198754 0%, #0d6efd 100%)',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container py-4">
          <span className="badge bg-white text-success fw-semibold mb-3 px-3 py-2 fs-6">
            Get in Touch
          </span>
          <h1 className="display-4 fw-bold mb-3">Contact Us</h1>
          <p className="lead mb-0 mx-auto" style={{ maxWidth: '560px' }}>
            Have questions about your event? We'd love to hear from you. Reach out and our team will
            get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            {contactInfo.map((item, i) => (
              <div key={i} className="col-sm-6 col-lg-3">
                <div className="card border-0 shadow-sm h-100 rounded-4 text-center p-4">
                  <div
                    className={`rounded-circle bg-${item.color} bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-4`}
                    style={{ width: '70px', height: '70px' }}
                  >
                    <i className={`bi ${item.icon} text-${item.color} fs-3`}></i>
                  </div>
                  <h6 className="fw-bold mb-3">{item.title}</h6>
                  {item.lines.map((line, j) => (
                    <p key={j} className="text-muted small mb-1">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Placeholder + Form */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            {/* Map */}
            <div className="col-lg-5">
              <h2 className="fw-bold mb-2">Find Us</h2>
              <p className="text-muted mb-4">
                Located in the heart of Mathura, UP — the city of celebrations. Come visit us!
              </p>
              <div
                className="rounded-4 overflow-hidden border shadow-sm d-flex align-items-center justify-content-center bg-light"
                style={{ height: '380px' }}
              >
                <div className="text-center text-muted p-4">
                  <i className="bi bi-map fs-1 text-primary opacity-50 mb-3 d-block"></i>
                  <p className="fw-semibold mb-1">EventHive HQ</p>
                  <p className="small">Near Vishram Ghat, Mathura, UP</p>
                  <a
                    href="https://maps.google.com/?q=Mathura,UP"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-primary mt-2 rounded-pill"
                  >
                    <i className="bi bi-box-arrow-up-right me-1"></i>
                    Open in Maps
                  </a>
                </div>
              </div>

              {/* Social */}
              <div className="mt-4">
                <h6 className="fw-bold mb-3">Follow Us</h6>
                <div className="d-flex gap-2">
                  {[
                    { icon: 'bi-instagram', color: '#E1306C' },
                    { icon: 'bi-facebook', color: '#1877F2' },
                    { icon: 'bi-twitter-x', color: '#000' },
                    { icon: 'bi-youtube', color: '#FF0000' },
                  ].map((s, i) => (
                    <a
                      key={i}
                      href="#!"
                      className="btn btn-light border rounded-circle p-0 d-flex align-items-center justify-content-center"
                      style={{ width: '44px', height: '44px', color: s.color }}
                    >
                      <i className={`bi ${s.icon}`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4 p-4 p-lg-5">
                <h2 className="fw-bold mb-2">Send Us a Message</h2>
                <p className="text-muted mb-4">
                  Fill in the form below and we'll get back to you as soon as possible.
                </p>

                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="contact-name" className="form-label fw-semibold">
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
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="contact-email" className="form-label fw-semibold">
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
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="contact-subject" className="form-label fw-semibold">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="contact-subject"
                        name="subject"
                        className="form-control"
                        placeholder="How can we help?"
                        value={form.subject}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="contact-message" className="form-label fw-semibold">
                        Message <span className="text-danger">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        className="form-control"
                        rows={6}
                        placeholder="Tell us about your event or inquiry..."
                        value={form.message}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>

                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-primary btn-lg rounded-pill fw-semibold">
                      <i className="bi bi-send me-2"></i>
                      Send Message
                    </button>
                  </div>

                  <p className="text-muted small text-center mt-3 mb-0">
                    <i className="bi bi-lock me-1"></i>
                    Your information is safe with us. We never share your data.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
