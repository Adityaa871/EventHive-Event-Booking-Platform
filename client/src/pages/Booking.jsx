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

  // ── Success Confirmation ──
  if (bookingSuccess) {
    return (
      <>
        {/* Header */}
        <section
          className="py-4 text-white text-center"
          style={{ background: 'linear-gradient(135deg, #198754 0%, #20c997 100%)' }}
        >
          <div className="container py-3">
            <div
              className="rounded-circle bg-white d-flex align-items-center justify-content-center mx-auto mb-4"
              style={{ width: '80px', height: '80px' }}
            >
              <i className="bi bi-check-lg text-success" style={{ fontSize: '2.5rem' }}></i>
            </div>
            <h1 className="display-6 fw-bold mb-2">Booking Confirmed! 🎉</h1>
            <p className="lead opacity-80 mb-0">
              Thank you for choosing EventHive. We've received your booking request.
            </p>
          </div>
        </section>

        <section className="py-5">
          <div className="container" style={{ maxWidth: '680px' }}>
            <div className="card border-0 shadow-sm rounded-4 p-4 p-lg-5 text-center">
              <i className="bi bi-envelope-check-fill text-primary fs-1 mb-4"></i>
              <h4 className="fw-bold mb-3">What Happens Next?</h4>
              <div className="row g-4 text-start mb-5">
                {[
                  {
                    step: '1',
                    icon: 'bi-envelope',
                    color: 'primary',
                    title: 'Confirmation Email',
                    desc: "You'll receive a booking confirmation email within a few minutes.",
                  },
                  {
                    step: '2',
                    icon: 'bi-telephone',
                    color: 'success',
                    title: "We'll Call You",
                    desc: 'Our event coordinator will call you within 24 hours to discuss your requirements.',
                  },
                  {
                    step: '3',
                    icon: 'bi-balloon-heart',
                    color: 'warning',
                    title: 'Plan & Celebrate',
                    desc: "We'll finalize every detail and make your event absolutely unforgettable!",
                  },
                ].map((item) => (
                  <div key={item.step} className="col-12">
                    <div className="d-flex align-items-start gap-3">
                      <div
                        className={`rounded-circle bg-${item.color} bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0`}
                        style={{ width: '48px', height: '48px' }}
                      >
                        <i className={`bi ${item.icon} text-${item.color}`}></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">{item.title}</h6>
                        <p className="text-muted small mb-0">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <button
                  className="btn btn-primary rounded-pill px-5"
                  onClick={() => setBookingSuccess(false)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Book Another Event
                </button>
                <Link to="/" className="btn btn-outline-secondary rounded-pill px-5">
                  <i className="bi bi-house me-2"></i>
                  Go Home
                </Link>
              </div>

              <p className="text-muted small mt-4 mb-0">
                Questions? Call us:{' '}
                <a href="tel:+919876543210" className="text-primary fw-semibold">
                  +91 98765 43210
                </a>
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ── Booking Form Page ──
  return (
    <>
      {/* Header */}
      <section
        className="py-5 text-white text-center"
        style={{
          background: 'linear-gradient(135deg, #6f42c1 0%, #0d6efd 100%)',
          minHeight: '280px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container py-3">
          <span className="badge bg-white bg-opacity-15 text-white fw-normal mb-3 px-3 py-2">
            Let's Get Started
          </span>
          <h1 className="display-5 fw-bold mb-2">Book Your Event</h1>
          <p className="lead opacity-75 mb-0 mx-auto" style={{ maxWidth: '520px' }}>
            Fill in the form below and our team will get back to you within 24 hours to confirm
            your booking.
          </p>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center g-5">
            {/* Form Column */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-4 p-lg-5">
                <div className="mb-4">
                  <h3 className="fw-bold mb-1">Booking Details</h3>
                  <p className="text-muted mb-0 small">
                    Fields marked with <span className="text-danger">*</span> are required.
                  </p>
                </div>

                {loadingPackages ? (
                  <div className="py-4">
                    <Loader />
                  </div>
                ) : packagesError ? (
                  <div className="mb-4">
                    <ErrorMessage message={packagesError} onRetry={fetchPackages} />
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

            {/* Sidebar */}
            <div className="col-lg-4">
              {/* Why Us */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-stars text-warning me-2"></i>
                  Why Choose EventHive?
                </h6>
                <ul className="list-unstyled mb-0">
                  {[
                    'Free initial consultation',
                    '10+ years of experience',
                    '500+ successful events',
                    '100% satisfaction guarantee',
                    'Transparent pricing',
                    'Dedicated event coordinator',
                  ].map((item, i) => (
                    <li key={i} className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-check-circle-fill text-success flex-shrink-0 small"></i>
                      <span className="small text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-headset text-primary me-2"></i>
                  Need Help?
                </h6>
                <p className="text-muted small mb-3">
                  Prefer to talk to someone? Our team is available 6 days a week.
                </p>
                <a
                  href="tel:+919876543210"
                  className="btn btn-outline-primary btn-sm rounded-pill w-100 mb-2"
                >
                  <i className="bi bi-telephone me-2"></i>
                  +91 98765 43210
                </a>
                <a
                  href="mailto:hello@eventhive.in"
                  className="btn btn-outline-secondary btn-sm rounded-pill w-100"
                >
                  <i className="bi bi-envelope me-2"></i>
                  hello@eventhive.in
                </a>
              </div>

              {/* Browse Packages */}
              <div
                className="card border-0 rounded-4 p-4 text-white"
                style={{ background: 'linear-gradient(135deg, #6f42c1, #0d6efd)' }}
              >
                <h6 className="fw-bold mb-2">Not sure which package?</h6>
                <p className="small opacity-75 mb-3">
                  Browse our full catalogue and find the perfect fit for your occasion.
                </p>
                <Link
                  to="/packages"
                  className="btn btn-light btn-sm rounded-pill fw-semibold"
                  style={{ color: '#6f42c1' }}
                >
                  <i className="bi bi-grid me-2"></i>
                  Browse Packages
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
