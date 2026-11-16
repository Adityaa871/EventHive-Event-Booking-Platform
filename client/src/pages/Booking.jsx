import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getPackages } from '../services/packageService';
import BookingForm from '../components/booking/BookingForm';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

export default function Booking() {
  const location = useLocation();
  const selectedPackageId = location.state?.packageId || '';

  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [packagesError, setPackagesError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const fetchPackages = async () => {
    setLoadingPackages(true);
    setPackagesError('');
    try {
      const data = await getPackages({ limit: 100 });
      setPackages(data.packages || data || []);
    } catch (err) {
      setPackagesError(
        err?.response?.data?.message || err?.message || 'Failed to load packages.'
      );
    } finally {
      setLoadingPackages(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSuccess = () => {
    setBookingSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Success Confirmation Screen ──
  if (bookingSuccess) {
    return (
      <div className="reveal-fade-up">
        <section
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '48px 0',
          }}
        >
          <div className="container text-center" style={{ maxWidth: '640px' }}>
            <div
              className="d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'var(--status-confirmed-bg)',
                border: '1px solid var(--status-confirmed-border)',
                color: 'var(--status-confirmed-text)',
              }}
            >
              <i className="bi bi-check2" style={{ fontSize: '1.75rem' }} aria-hidden="true" />
            </div>
            <h1 className="h3 fw-bold mb-2">Booking Inquiry Received</h1>
            <p className="text-secondary mb-0">
              Thank you for submitting your event details. A dedicated coordinator has been assigned to your request.
            </p>
          </div>
        </section>

        <section className="py-5">
          <div className="container" style={{ maxWidth: '680px' }}>
            <div
              className="p-4 p-md-5 card-tactile"
              style={{ backgroundColor: 'var(--bg-surface)' }}
            >
              <h2 className="h5 fw-bold mb-4 pb-2 border-bottom">Next Steps</h2>
              <div className="d-flex flex-column gap-4 mb-5">
                {[
                  {
                    step: '1',
                    title: 'Availability & Schedule Check',
                    desc: 'We verify our vendor network, venue access, and logistics for your selected date.',
                  },
                  {
                    step: '2',
                    title: 'Direct Phone Consultation',
                    desc: 'Our planner will phone you within 24 business hours to finalize scope, styling, and specific additions.',
                  },
                  {
                    step: '3',
                    title: 'Proposal & Date Confirmation',
                    desc: 'We provide an itemized quote and formal contract with clear milestone timelines.',
                  },
                ].map((item) => (
                  <div key={item.step} className="d-flex gap-3 align-items-start">
                    <span
                      className="d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-surface-subtle)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12px',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {item.step}
                    </span>
                    <div>
                      <div className="fw-bold" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                        {item.title}
                      </div>
                      <p className="small text-muted mb-0 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex gap-3 justify-content-center flex-wrap pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-tactile"
                  onClick={() => setBookingSuccess(false)}
                >
                  Book another event
                </button>
                <Link to="/" className="btn btn-primary btn-tactile">
                  Return to home
                </Link>
              </div>

              <p className="text-center text-muted small mt-4 mb-0">
                Questions right now? Call us directly at{' '}
                <a href="tel:+919876543210" className="fw-semibold text-dark">
                  +91 98765 43210
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── Booking Inquiry Form Page ──
  return (
    <div className="reveal-fade-up">
      {/* ── Page Header ── */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          paddingTop: '48px',
          paddingBottom: '48px',
        }}
      >
        <div className="container">
          <div className="d-inline-flex align-items-center gap-2 mb-2 text-muted small text-uppercase fw-semibold" style={{ letterSpacing: '0.06em' }}>
            <span>Booking Request</span>
            <span>•</span>
            <span>Custom Quote</span>
          </div>
          <h1 className="h2 fw-bold mb-2">Plan Your Event</h1>
          <p className="text-secondary mb-0" style={{ maxWidth: '580px' }}>
            Provide your event requirements below. Our event production team will review availability and prepare a comprehensive proposal.
          </p>
        </div>
      </section>

      {/* ── Main Form Section ── */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            {/* Form Column */}
            <div className="col-lg-8">
              <div
                className="p-4 p-md-5 card-tactile"
                style={{ backgroundColor: 'var(--bg-surface)' }}
              >
                <div className="mb-4 pb-3 border-bottom">
                  <h2 className="h4 fw-bold mb-1">Event Inquiries & Coordination</h2>
                  <p className="text-muted small mb-0">
                    Fields marked with <span className="text-danger">*</span> are mandatory for schedule verification.
                  </p>
                </div>

                {loadingPackages ? (
                  <div className="py-4 text-center">
                    <Loader />
                  </div>
                ) : packagesError ? (
                  <div className="mb-4">
                    <ErrorMessage message={packagesError} />
                  </div>
                ) : null}

                {!loadingPackages && (
                  <BookingForm
                    packages={packages}
                    selectedPackageId={selectedPackageId}
                    onSuccess={handleSuccess}
                  />
                )}
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="col-lg-4">
              {/* Trust Callout */}
              <div
                className="p-4 mb-4 card-tactile"
                style={{ backgroundColor: 'var(--bg-surface)' }}
              >
                <h3 className="h6 fw-bold mb-3 text-uppercase" style={{ letterSpacing: '0.05em' }}>
                  What to expect
                </h3>
                <ul className="list-unstyled d-flex flex-column gap-3 mb-0" style={{ fontSize: '13px' }}>
                  {[
                    'Direct contact with a dedicated regional coordinator',
                    'Zero hidden fees or surprise vendor markups',
                    'Transparent milestones and vendor scheduling',
                    'Backup contingency planning for outdoor events',
                  ].map((item, i) => (
                    <li key={i} className="d-flex align-items-start gap-2 text-secondary">
                      <i className="bi bi-check2 text-dark fw-bold mt-1" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct Help */}
              <div
                className="p-4 mb-4 card-tactile"
                style={{ backgroundColor: 'var(--bg-surface)' }}
              >
                <h3 className="h6 fw-bold mb-2">Need immediate assistance?</h3>
                <p className="text-muted small mb-3">
                  Our planning office is available Monday through Saturday, 9 AM to 7 PM IST.
                </p>
                <div className="d-flex flex-column gap-2">
                  <a
                    href="tel:+919876543210"
                    className="btn btn-outline-secondary btn-tactile btn-sm w-100 justify-content-center"
                  >
                    <i className="bi bi-telephone me-2" aria-hidden="true" />
                    +91 98765 43210
                  </a>
                  <a
                    href="mailto:hello@eventhive.in"
                    className="btn btn-outline-secondary btn-tactile btn-sm w-100 justify-content-center"
                  >
                    <i className="bi bi-envelope me-2" aria-hidden="true" />
                    hello@eventhive.in
                  </a>
                </div>
              </div>

              {/* Explore Packages */}
              <div
                className="p-4 card-tactile"
                style={{ backgroundColor: 'var(--bg-surface-subtle)' }}
              >
                <h3 className="h6 fw-bold mb-1">Looking for package inspiration?</h3>
                <p className="small text-muted mb-3">
                  Check pre-assembled wedding, birthday, and corporate packages before submitting.
                </p>
                <Link
                  to="/packages"
                  className="btn btn-primary btn-tactile btn-sm w-100 justify-content-center"
                >
                  Browse catalog
                  <i className="bi bi-arrow-right ms-2 icon-nudge" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
