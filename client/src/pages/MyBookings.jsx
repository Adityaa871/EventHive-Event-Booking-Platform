import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getMyBookings,
  requestCancellation,
  requestReschedule,
  downloadInvoice,
} from '../services/bookingService';
import { createReview } from '../services/reviewService';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import AvailabilityCalendar from '../components/calendar/AvailabilityCalendar';
import toast from 'react-hot-toast';

const statusClass = (status) => {
  const map = {
    new: 'status-new',
    pending: 'status-new',
    contacted: 'status-contacted',
    confirmed: 'status-confirmed',
    in_progress: 'status-contacted',
    completed: 'status-confirmed',
    cancelled: 'status-cancelled',
  };
  return map[status] || 'badge-neutral';
};

const MyBookings = () => {
  const [data, setData] = useState({ upcoming: [], past: [], all: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past' | 'all'

  // Modals state
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [submittingCancel, setSubmittingCancel] = useState(false);

  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [submittingReschedule, setSubmittingReschedule] = useState(false);

  const [reviewTarget, setReviewTarget] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const [downloadingId, setDownloadingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getMyBookings();
      setData(res);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load your reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation.');
      return;
    }
    try {
      setSubmittingCancel(true);
      await requestCancellation(cancelTarget._id, cancelReason);
      toast.success('Cancellation request submitted for administrative review.');
      setCancelTarget(null);
      setCancelReason('');
      fetchBookings();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit cancellation request.');
    } finally {
      setSubmittingCancel(false);
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleDate) {
      toast.error('Please select a new event date.');
      return;
    }
    try {
      setSubmittingReschedule(true);
      await requestReschedule(rescheduleTarget._id, rescheduleDate, rescheduleReason);
      toast.success('Reschedule request submitted for administrative review.');
      setRescheduleTarget(null);
      setRescheduleDate('');
      setRescheduleReason('');
      fetchBookings();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit reschedule request.');
    } finally {
      setSubmittingReschedule(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please share some feedback about your event.');
      return;
    }
    try {
      setSubmittingReview(true);
      await createReview({
        bookingId: reviewTarget._id,
        rating,
        comment,
      });
      toast.success('Thank you! Your verified review has been published.');
      setReviewTarget(null);
      setComment('');
      fetchBookings();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to publish review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDownload = async (booking) => {
    try {
      setDownloadingId(booking._id);
      await downloadInvoice(
        booking._id,
        `EventHive-Invoice-${booking.invoiceNumber || booking._id.slice(-6).toUpperCase()}.pdf`
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to download invoice PDF.');
    } finally {
      setDownloadingId(null);
    }
  };

  const currentList =
    activeTab === 'upcoming'
      ? data.upcoming
      : activeTab === 'past'
      ? data.past
      : data.all;

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-canvas)', minHeight: 'calc(100vh - 160px)' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Page Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <span
              className="text-uppercase small fw-bold text-muted mb-1 d-block"
              style={{ letterSpacing: '0.08em', fontSize: '11px' }}
            >
              Account Management
            </span>
            <h1 className="h3 fw-bold tracking-tight mb-1">My Reservations & Bookings</h1>
            <p className="text-secondary small mb-0">
              Manage your event dates, view payment summaries, and track scheduling status.
            </p>
          </div>
          <Link to="/book" className="btn btn-primary btn-tactile">
            <i className="bi bi-calendar-plus me-2" aria-hidden="true" />
            Book New Event
          </Link>
        </div>

        {/* Tab Filters */}
        <div className="d-flex gap-2 mb-4 border-bottom pb-2">
          <button
            type="button"
            className={`btn btn-sm btn-tactile ${
              activeTab === 'upcoming' ? 'btn-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Events ({data.upcoming?.length || 0})
          </button>
          <button
            type="button"
            className={`btn btn-sm btn-tactile ${
              activeTab === 'past' ? 'btn-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => setActiveTab('past')}
          >
            Past Events ({data.past?.length || 0})
          </button>
          <button
            type="button"
            className={`btn btn-sm btn-tactile ${
              activeTab === 'all' ? 'btn-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Bookings ({data.all?.length || 0})
          </button>
        </div>

        {loading ? (
          <div className="p-5 text-center">
            <Loader />
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : currentList.length === 0 ? (
          <div
            className="card-tactile p-5 text-center"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <i className="bi bi-calendar2-x fs-2 text-muted mb-3 d-block" aria-hidden="true" />
            <h2 className="h5 fw-bold text-dark mb-2">No {activeTab} bookings found</h2>
            <p className="text-secondary small mb-4">
              You haven't scheduled any events in this section yet.
            </p>
            <Link to="/packages" className="btn btn-primary btn-tactile">
              Explore Event Packages
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {currentList.map((booking) => {
              const dateFormatted = new Date(booking.eventDate).toLocaleDateString('en-IN', {
                weekday: 'short',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              });

              const isCompleted = booking.status === 'completed';
              const isCancelled = booking.status === 'cancelled';
              const isPending = booking.status === 'pending';
              const isConfirmed = booking.status === 'confirmed';

              const canModify = !isCompleted && !isCancelled;

              return (
                <div
                  key={booking._id}
                  className="card-tactile p-4"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div className="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-3">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className={`badge ${statusClass(booking.status)} text-capitalize`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                        {booking.cancellationRequest?.requested && (
                          <span className="badge badge-neutral" style={{ color: '#b91c1c' }}>
                            Cancellation {booking.cancellationRequest.status}
                          </span>
                        )}
                        {booking.rescheduleRequest?.requested && (
                          <span className="badge badge-neutral" style={{ color: '#1d4ed8' }}>
                            Reschedule {booking.rescheduleRequest.status}
                          </span>
                        )}
                        <span className="text-muted small">
                          Ref: #{booking._id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <h2 className="h5 fw-bold text-dark mb-0">
                        {booking.package?.title || booking.packageName || `${booking.eventType} Celebration`}
                      </h2>
                    </div>

                    <div className="text-end">
                      <div className="fw-bold text-dark fs-5">
                        ₹
                        {(
                          booking.priceDetails?.finalPrice ||
                          booking.budget ||
                          booking.package?.price ||
                          0
                        ).toLocaleString('en-IN')}
                      </div>
                      {booking.priceDetails?.discountAmount > 0 && (
                        <div className="small text-success">
                          Saved ₹{booking.priceDetails.discountAmount.toLocaleString('en-IN')} (
                          {booking.priceDetails.couponCode})
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row g-3 py-2 border-top border-bottom my-2 small">
                    <div className="col-12 col-sm-6 col-md-3">
                      <span className="text-muted d-block" style={{ fontSize: '11px' }}>
                        TARGET DATE
                      </span>
                      <span className="fw-semibold text-dark">{dateFormatted}</span>
                    </div>

                    <div className="col-12 col-sm-6 col-md-3">
                      <span className="text-muted d-block" style={{ fontSize: '11px' }}>
                        OCCASION TYPE
                      </span>
                      <span className="text-capitalize fw-semibold text-dark">{booking.eventType}</span>
                    </div>

                    <div className="col-12 col-sm-6 col-md-3">
                      <span className="text-muted d-block" style={{ fontSize: '11px' }}>
                        HEADCOUNT
                      </span>
                      <span className="fw-semibold text-dark">{booking.guestCount} Attendees</span>
                    </div>

                    <div className="col-12 col-sm-6 col-md-3">
                      <span className="text-muted d-block" style={{ fontSize: '11px' }}>
                        LOCATION / VENUE
                      </span>
                      <span className="fw-semibold text-dark text-truncate d-block">
                        {booking.venue || 'Client Venue'}
                      </span>
                    </div>
                  </div>

                  {/* History / Status Updates Summary */}
                  {booking.history?.length > 0 && (
                    <div className="mt-2 mb-3">
                      <span className="text-muted small fw-semibold text-uppercase d-block mb-1" style={{ fontSize: '11px' }}>
                        Booking History & Timeline
                      </span>
                      <div
                        className="p-2 px-3 rounded small"
                        style={{
                          backgroundColor: 'var(--bg-surface-subtle)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '12px',
                        }}
                      >
                        {booking.history.map((h, i) => (
                          <div key={i} className="d-flex align-items-center justify-content-between py-1">
                            <div>
                              <strong className="text-dark text-capitalize">{h.status}:</strong>{' '}
                              <span className="text-secondary">{h.note || 'Status updated'}</span>
                            </div>
                            <span className="text-muted" style={{ fontSize: '11px' }}>
                              {new Date(h.timestamp).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 pt-2">
                    <div className="d-flex gap-2">
                      {/* Download Invoice (for confirmed / completed) */}
                      {(isConfirmed || isCompleted) && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary btn-tactile"
                          onClick={() => handleDownload(booking)}
                          disabled={downloadingId === booking._id}
                        >
                          <i className="bi bi-file-earmark-pdf me-1" aria-hidden="true" />
                          {downloadingId === booking._id ? 'Generating…' : 'Invoice PDF'}
                        </button>
                      )}

                      {/* Write Review for completed */}
                      {isCompleted && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary btn-tactile"
                          onClick={() => setReviewTarget(booking)}
                        >
                          <i className="bi bi-star me-1" aria-hidden="true" />
                          Leave Review
                        </button>
                      )}
                    </div>

                    {canModify && (
                      <div className="d-flex gap-2">
                        {/* Request Rescheduling */}
                        {!booking.rescheduleRequest?.requested && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary btn-tactile"
                            onClick={() => {
                              setRescheduleTarget(booking);
                              setRescheduleDate('');
                              setRescheduleReason('');
                            }}
                          >
                            <i className="bi bi-calendar-event me-1" aria-hidden="true" />
                            Reschedule
                          </button>
                        )}

                        {/* Request Cancellation */}
                        {!booking.cancellationRequest?.requested && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger btn-tactile"
                            onClick={() => {
                              setCancelTarget(booking);
                              setCancelReason('');
                            }}
                          >
                            Request Cancellation
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      {cancelTarget && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(9, 9, 11, 0.6)', zIndex: 1050 }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content card-tactile shadow-sm">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Request Booking Cancellation</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setCancelTarget(null)}
                  aria-label="Close"
                />
              </div>
              <form onSubmit={handleCancelSubmit}>
                <div className="modal-body p-4">
                  <p className="text-secondary small">
                    Are you sure you want to request cancellation for your event on{' '}
                    <strong>
                      {new Date(cancelTarget.eventDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </strong>
                    ? Our administration will review your request.
                  </p>
                  <label className="form-label" htmlFor="cancelReason">
                    Reason for Cancellation <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="cancelReason"
                    className="form-control"
                    rows={3}
                    placeholder="Please specify why you need to cancel this event…"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-tactile"
                    onClick={() => setCancelTarget(null)}
                  >
                    Keep Booking
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger btn-tactile"
                    disabled={submittingCancel}
                  >
                    {submittingCancel ? 'Submitting…' : 'Submit Cancellation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(9, 9, 11, 0.6)', zIndex: 1050 }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content card-tactile shadow-sm">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Request Date Rescheduling</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setRescheduleTarget(null)}
                  aria-label="Close"
                />
              </div>
              <form onSubmit={handleRescheduleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label">
                        Select New Event Date <span className="text-danger">*</span>
                      </label>
                      <AvailabilityCalendar
                        selectedDate={rescheduleDate}
                        onSelectDate={(d) => setRescheduleDate(d)}
                        packageId={rescheduleTarget.package?._id}
                      />
                      {rescheduleDate && (
                        <div className="mt-2 text-dark small fw-semibold">
                          Proposed Date: {rescheduleDate}
                        </div>
                      )}
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="rescheduleReason">
                        Reason / Notes for Admin
                      </label>
                      <textarea
                        id="rescheduleReason"
                        className="form-control"
                        rows={4}
                        placeholder="Explain the reason for date shift or any special instructions…"
                        value={rescheduleReason}
                        onChange={(e) => setRescheduleReason(e.target.value)}
                      />
                      <div className="form-text mt-3">
                        Rescheduling is subject to venue availability and administrative approval.
                        Once reviewed, you will receive an email confirmation.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-tactile"
                    onClick={() => setRescheduleTarget(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-tactile"
                    disabled={submittingReschedule || !rescheduleDate}
                  >
                    {submittingReschedule ? 'Submitting…' : 'Submit Reschedule Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewTarget && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(9, 9, 11, 0.6)', zIndex: 1050 }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content card-tactile shadow-sm">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Leave a Verified Review</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setReviewTarget(null)}
                  aria-label="Close"
                />
              </div>
              <form onSubmit={handleReviewSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label d-block">Overall Rating</label>
                    <div className="d-flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="btn p-1"
                          onClick={() => setRating(star)}
                          style={{
                            fontSize: '24px',
                            color: star <= rating ? '#eab308' : '#d4d4d8',
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="reviewComment">
                      Your Experience & Feedback <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="reviewComment"
                      className="form-control"
                      rows={4}
                      placeholder="Share how the arrangement, catering, or styling turned out for your celebration…"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-tactile"
                    onClick={() => setReviewTarget(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-tactile"
                    disabled={submittingReview}
                  >
                    {submittingReview ? 'Publishing…' : 'Publish Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
