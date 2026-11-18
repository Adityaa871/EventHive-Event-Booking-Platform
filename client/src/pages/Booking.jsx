import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getPackages } from '../services/packageService';
import { downloadInvoice } from '../services/bookingService';
import BookingForm from '../components/booking/BookingForm';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import toast from 'react-hot-toast';

export default function Booking() {
  const location = useLocation();
  const selectedPackageId = location.state?.packageId || '';

  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [packagesError, setPackagesError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [downloading, setDownloading] = useState(false);

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

  const handleSuccess = (bookingData) => {
    setConfirmedBooking(bookingData?.data || bookingData);
    setBookingSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadInvoice = async () => {
    if (!confirmedBooking?._id) return;
    try {
      setDownloading(true);
      await downloadInvoice(
        confirmedBooking._id,
        `EventHive-Invoice-${confirmedBooking.invoiceNumber || confirmedBooking._id.slice(-6).toUpperCase()}.pdf`
      );
      toast.success('Invoice downloaded successfully.');
    } catch (err) {
      toast.error('Failed to download invoice PDF.');
    } finally {
      setDownloading(false);
    }
  };

  // ── Success Confirmation Screen ──
  if (bookingSuccess) {
    const isPaid = confirmedBooking?.paymentDetails?.status === 'paid';
    const txnId = confirmedBooking?.paymentDetails?.transactionId;
    const paidAmount = confirmedBooking?.paymentDetails?.paidAmount || confirmedBooking?.priceDetails?.finalPrice || 0;
    const paymentMethod = confirmedBooking?.paymentDetails?.method?.toUpperCase() || 'ONLINE';

    return (
      <>
        {/* Header */}
        <section
          className="py-5 text-center border-bottom"
          style={{ backgroundColor: 'var(--bg-surface)' }}
        >
          <div className="container py-2" style={{ maxWidth: '640px' }}>
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'var(--status-confirmed-bg)',
                border: '1px solid var(--status-confirmed-border)',
              }}
            >
              <i className="bi bi-check-lg text-success" style={{ fontSize: '2rem' }} />
            </div>
            <h1 className="h3 fw-bold tracking-tight mb-2">
              {isPaid ? 'Payment Verified & Booking Confirmed' : 'Booking Request Submitted'}
            </h1>
            <p className="text-secondary small mb-0">
              Thank you for choosing EventHive. Your reservation has been logged into our verified event schedule.
            </p>
          </div>
        </section>

        <section className="py-5" style={{ backgroundColor: 'var(--bg-canvas)' }}>
          <div className="container" style={{ maxWidth: '680px' }}>
            <div
              className="card-tactile p-4 p-lg-5 mb-4"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              {/* Payment Receipt Voucher */}
              {isPaid && (
                <div
                  className="p-3 mb-4 rounded border"
                  style={{ backgroundColor: '#fcfcfc', borderColor: 'var(--border-subtle)' }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge bg-success">
                      <i className="bi bi-shield-check me-1" />
                      Payment Successful
                    </span>
                    <span className="small text-muted" style={{ fontSize: '11px' }}>
                      Invoice: {confirmedBooking.invoiceNumber || `#INV-${confirmedBooking._id.slice(-6).toUpperCase()}`}
                    </span>
                  </div>

                  <div className="row g-2 small">
                    <div className="col-6">
                      <span className="text-muted d-block" style={{ fontSize: '11px' }}>
                        TRANSACTION ID
                      </span>
                      <span className="fw-semibold text-dark font-monospace">{txnId}</span>
                    </div>

                    <div className="col-6 text-end">
                      <span className="text-muted d-block" style={{ fontSize: '11px' }}>
                        AMOUNT AUTHORIZED
                      </span>
                      <span className="fw-bold text-dark fs-6">
                        ₹{paidAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="col-6">
                      <span className="text-muted d-block" style={{ fontSize: '11px' }}>
                        PAYMENT METHOD
                      </span>
                      <span className="text-dark fw-medium">{paymentMethod} Gateway</span>
                    </div>

                    <div className="col-6 text-end">
                      <span className="text-muted d-block" style={{ fontSize: '11px' }}>
                        STATUS
                      </span>
                      <span className="text-success fw-semibold">Confirmed</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-top d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary btn-tactile"
                      onClick={handleDownloadInvoice}
                      disabled={downloading}
                    >
                      <i className="bi bi-file-earmark-pdf me-1 text-danger" />
                      {downloading ? 'Preparing PDF…' : 'Download Booking Invoice (PDF)'}
                    </button>
                  </div>
                </div>
              )}

              <h4 className="fw-bold mb-3 h6 text-uppercase" style={{ letterSpacing: '0.04em' }}>
                Next Planning Steps
              </h4>
              <div className="row g-3 text-start mb-4">
                {[
                  {
                    step: '1',
                    icon: 'bi-envelope-check',
                    title: 'Voucher & Confirmation Email',
                    desc: "A verified reservation receipt and coordinator briefing has been dispatched to your email address.",
                  },
                  {
                    step: '2',
                    icon: 'bi-headset',
                    title: 'Coordinator Contact',
                    desc: 'Your dedicated lead planner will contact you via phone or WhatsApp within 24 hours to review venue logistics.',
                  },
                  {
                    step: '3',
                    icon: 'bi-stars',
                    title: 'Tailored Execution',
                    desc: 'We finalize vendor timings, stage styling, catering tasting, and deliver a seamless event experience.',
                  },
                ].map((item) => (
                  <div key={item.step} className="col-12">
                    <div className="d-flex align-items-start gap-3 p-2">
                      <div
                        className="rounded d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'var(--bg-surface-subtle)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <i className={`bi ${item.icon} text-dark`} />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1 small">{item.title}</h6>
                        <p className="text-secondary small mb-0">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex gap-2 justify-content-center flex-wrap pt-2 border-top">
                <Link to="/my-bookings" className="btn btn-primary btn-tactile">
                  <i className="bi bi-calendar-check me-2" />
                  View in My Reservations
                </Link>

                <button
                  type="button"
                  className="btn btn-outline-secondary btn-tactile"
                  onClick={() => {
                    setConfirmedBooking(null);
                    setBookingSuccess(false);
                  }}
                >
                  <i className="bi bi-plus-circle me-2" />
                  Book Another Event
                </button>
              </div>

              <p className="text-muted small mt-4 mb-0 text-center">
                Need urgent planning adjustments? Direct concierge helpline:{' '}
                <a href="tel:+919876543210" className="text-dark fw-semibold">
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
        className="py-5 border-bottom text-center"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <div className="container py-2" style={{ maxWidth: '680px' }}>
          <span
            className="text-uppercase small fw-bold text-muted mb-2 d-block"
            style={{ letterSpacing: '0.08em', fontSize: '11px' }}
          >
            Seamless Event Scheduling
          </span>
          <h1 className="h2 fw-bold tracking-tight mb-2">Plan Your Event with EventHive</h1>
          <p className="text-secondary small mb-0">
            Tell us about your target date, occasion, and preferences. Complete payment securely to lock your date instantly.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-canvas)' }}>
        <div className="container">
          <div className="row g-4 justify-content-center">
            {/* Form Column */}
            <div className="col-12 col-lg-8">
              <div
                className="card-tactile p-4 p-md-5"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div className="mb-4">
                  <h2 className="h5 fw-bold text-dark mb-1">Event Details & Inclusions</h2>
                  <p className="text-secondary small mb-0">
                    Fill in your event parameters below. Clicking "Submit event inquiry" will launch the secure checkout screen.
                  </p>
                </div>

                {loadingPackages ? (
                  <div className="p-5 text-center">
                    <Loader />
                  </div>
                ) : packagesError ? (
                  <ErrorMessage message={packagesError} />
                ) : (
                  <BookingForm
                    packages={packages}
                    selectedPackageId={selectedPackageId}
                    onSuccess={handleSuccess}
                  />
                )}
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="col-12 col-lg-4">
              {/* Trust Box */}
              <div
                className="card-tactile p-4 mb-4"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <h6 className="fw-bold mb-3 small text-uppercase" style={{ letterSpacing: '0.04em' }}>
                  The EventHive Commitment
                </h6>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-3 small">
                  {[
                    {
                      icon: 'bi-shield-check',
                      title: 'Secure Payment Gateway',
                      desc: 'UPI, Credit/Debit cards, and Net Banking supported with instant verification.',
                    },
                    {
                      icon: 'bi-currency-rupee',
                      title: 'Transparent Pricing',
                      desc: 'All inclusions clearly outlined. No hidden markups or surprise charges.',
                    },
                    {
                      icon: 'bi-clock-history',
                      title: 'Flexible Rescheduling',
                      desc: 'Adjust your booking date easily from your client portal subject to venue slot.',
                    },
                    {
                      icon: 'bi-file-earmark-pdf',
                      title: 'Downloadable Invoices',
                      desc: 'Verified PDF booking invoices issued immediately upon transaction confirmation.',
                    },
                  ].map((p, idx) => (
                    <li key={idx} className="d-flex align-items-start gap-2">
                      <i className={`bi ${p.icon} text-primary mt-1`} />
                      <div>
                        <strong className="text-dark d-block">{p.title}</strong>
                        <span className="text-secondary">{p.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct Concierge Help */}
              <div
                className="card-tactile p-4 mb-4"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <h6 className="fw-bold mb-2 small text-uppercase" style={{ letterSpacing: '0.04em' }}>
                  Need Guidance?
                </h6>
                <p className="text-secondary small mb-3">
                  Speak directly with a senior planner about customized arrangements.
                </p>
                <a
                  href="tel:+919876543210"
                  className="btn btn-outline-secondary btn-tactile btn-sm w-100 mb-2"
                >
                  <i className="bi bi-telephone me-2" />
                  +91 98765 43210
                </a>
                <a
                  href="mailto:hello@eventhive.in"
                  className="btn btn-outline-secondary btn-tactile btn-sm w-100"
                >
                  <i className="bi bi-envelope me-2" />
                  hello@eventhive.in
                </a>
              </div>

              {/* Browse Catalog CTA */}
              <div
                className="card-tactile p-4"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <h6 className="fw-bold mb-2 small text-uppercase" style={{ letterSpacing: '0.04em' }}>
                  Explore All Packages
                </h6>
                <p className="text-secondary small mb-3">
                  Compare our curated birthday, wedding, anniversary, and corporate catalog offerings.
                </p>
                <Link to="/packages" className="btn btn-primary btn-tactile btn-sm w-100">
                  <i className="bi bi-grid me-2" />
                  Browse Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
