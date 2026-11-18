import { useState, useEffect } from 'react';
import { createBooking } from '../../services/bookingService';
import PaymentGatewayModal from './PaymentGatewayModal';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  package: '',
  eventType: '',
  eventDate: '',
  guestCount: '',
  venue: '',
  budget: '',
  message: '',
};

const eventTypes = [
  { value: 'birthday', label: 'Birthday' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'other', label: 'Other' },
];

const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const validate = (form) => {
  const errors = {};

  if (!form.name.trim()) errors.name = 'Full name is required.';

  if (!form.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!form.phone.trim()) {
    errors.phone = 'Mobile phone number is required.';
  } else if (!/^[6-9]\d{9}$/.test(form.phone)) {
    errors.phone = 'Please provide a valid 10-digit Indian mobile number.';
  }

  if (!form.eventType) errors.eventType = 'Please select an event type.';

  if (!form.eventDate) {
    errors.eventDate = 'Target event date is required.';
  } else {
    const selected = new Date(form.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) errors.eventDate = 'Event date cannot be in the past.';
  }

  if (!form.guestCount) {
    errors.guestCount = 'Estimated guest count is required.';
  } else if (Number(form.guestCount) < 1) {
    errors.guestCount = 'Guest count must be at least 1.';
  }

  return errors;
};

const Field = ({ label, name, required, children, hint, error }) => (
  <div className="mb-3">
    <label htmlFor={name} className="form-label d-block">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    {children}
    {hint && !error && <div className="form-text">{hint}</div>}
    {error && (
      <div className="invalid-feedback d-block mt-1" style={{ fontSize: '12px' }}>
        {error}
      </div>
    )}
  </div>
);

export default function BookingForm({ packages = [], selectedPackageId = '', onSuccess }) {
  const [form, setForm] = useState({ ...initialForm, package: selectedPackageId || '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  useEffect(() => {
    if (selectedPackageId) {
      setForm((prev) => ({ ...prev, package: selectedPackageId }));
    }
  }, [selectedPackageId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const selectedPkg = packages.find((p) => p._id === form.package);

  const bookingDetails = {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    eventType: form.eventType,
    eventDate: form.eventDate,
    guestCount: form.guestCount,
    packageName: selectedPkg?.title || selectedPkg?.name || 'Custom Inclusions Package',
    packagePrice: selectedPkg?.price || 0,
    budget: Number(form.budget) || 0,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError('');

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Launch the Payment Gateway Screen
    setShowPaymentGateway(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    setLoading(true);
    setApiError('');
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        eventType: form.eventType,
        eventDate: form.eventDate,
        guestCount: Number(form.guestCount),
        ...(form.package && { package: form.package }),
        ...(form.venue.trim() && { venue: form.venue.trim() }),
        budget: paymentData.totalBookingPrice || (selectedPkg?.price || Number(form.budget) || 25000),
        ...(form.message.trim() && { message: form.message.trim() }),
        couponCode: paymentData.couponCode || undefined,
        paymentDetails: {
          status: 'paid',
          method: paymentData.paymentMethod,
          transactionId: paymentData.transactionId,
          paidAmount: paymentData.paidAmount,
        },
      };

      const result = await createBooking(payload);
      setShowPaymentGateway(false);
      setForm({ ...initialForm, package: selectedPackageId || '' });
      setErrors({});
      if (onSuccess) onSuccess(result);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong creating your reservation. Please try again.';
      setApiError(msg);
      setShowPaymentGateway(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        {apiError && (
          <div
            className="alert alert-danger d-flex align-items-center gap-2 mb-4"
            role="alert"
            style={{
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              backgroundColor: 'var(--status-cancelled-bg)',
              borderColor: 'var(--status-cancelled-border)',
              color: 'var(--status-cancelled-text)',
            }}
          >
            <i className="bi bi-exclamation-circle" aria-hidden="true" />
            <span>{apiError}</span>
          </div>
        )}

        <div className="row g-3">
          {/* Full Name */}
          <div className="col-md-6">
            <Field label="Full Name" name="name" required error={errors.name}>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-control ${errors.name ? 'is-invalid border-danger' : ''}`}
                placeholder="e.g. Priya Sharma"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </Field>
          </div>

          {/* Email Address */}
          <div className="col-md-6">
            <Field label="Email Address" name="email" required error={errors.email}>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${errors.email ? 'is-invalid border-danger' : ''}`}
                placeholder="priya@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </Field>
          </div>

          {/* Phone Number */}
          <div className="col-md-6">
            <Field label="Mobile Phone" name="phone" required hint="10-digit Indian mobile number" error={errors.phone}>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={`form-control ${errors.phone ? 'is-invalid border-danger' : ''}`}
                placeholder="9876543210"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                autoComplete="tel"
              />
            </Field>
          </div>

          {/* Package Selector */}
          <div className="col-md-6">
            <Field label="Package Selection" name="package" error={errors.package}>
              <select
                id="package"
                name="package"
                className="form-select"
                value={form.package}
                onChange={handleChange}
              >
                <option value="">— Custom or Unspecified Package —</option>
                {packages.map((pkg) => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.title || pkg.name} {pkg.price ? `(₹${pkg.price.toLocaleString('en-IN')})` : ''}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Event Type */}
          <div className="col-md-6">
            <Field label="Event Type" name="eventType" required error={errors.eventType}>
              <select
                id="eventType"
                name="eventType"
                className={`form-select ${errors.eventType ? 'is-invalid border-danger' : ''}`}
                value={form.eventType}
                onChange={handleChange}
              >
                <option value="">— Select occasion —</option>
                {eventTypes.map((et) => (
                  <option key={et.value} value={et.value}>
                    {et.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Event Date */}
          <div className="col-md-6">
            <Field label="Target Event Date" name="eventDate" required error={errors.eventDate}>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                className={`form-control ${errors.eventDate ? 'is-invalid border-danger' : ''}`}
                value={form.eventDate}
                onChange={handleChange}
                min={getTodayString()}
              />
            </Field>
          </div>

          {/* Guest Count */}
          <div className="col-md-6">
            <Field label="Estimated Attendees" name="guestCount" required error={errors.guestCount}>
              <input
                type="number"
                id="guestCount"
                name="guestCount"
                className={`form-control ${errors.guestCount ? 'is-invalid border-danger' : ''}`}
                placeholder="50"
                value={form.guestCount}
                onChange={handleChange}
                min={1}
              />
            </Field>
          </div>

          {/* Venue / City */}
          <div className="col-md-6">
            <Field label="Preferred Venue or Area" name="venue" error={errors.venue}>
              <input
                type="text"
                id="venue"
                name="venue"
                className="form-control"
                placeholder="e.g. Hotel / Lawn in Mathura"
                value={form.venue}
                onChange={handleChange}
              />
            </Field>
          </div>

          {/* Budget */}
          <div className="col-md-6">
            <Field label="Estimated Budget (₹ INR)" name="budget" error={errors.budget}>
              <input
                type="number"
                id="budget"
                name="budget"
                className="form-control"
                placeholder="e.g. 150000"
                value={form.budget}
                onChange={handleChange}
                min={0}
              />
            </Field>
          </div>

          {/* Message */}
          <div className="col-12">
            <Field label="Specific Requirements & Special Notes" name="message" error={errors.message}>
              <textarea
                id="message"
                name="message"
                className="form-control"
                rows={4}
                placeholder="Tell us about decor preferences, catering dietary requirements, stage arrangements, or timing notes..."
                value={form.message}
                onChange={handleChange}
              />
            </Field>
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            className="btn btn-primary btn-tactile btn-lg w-100"
            disabled={loading}
            style={{ padding: '12px 24px', fontSize: '15px' }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Processing booking...
              </>
            ) : (
              <>
                <i className="bi bi-shield-lock me-2" aria-hidden="true" />
                Submit event inquiry
                <i className="bi bi-arrow-right ms-2 icon-nudge" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Payment Gateway Modal */}
      <PaymentGatewayModal
        show={showPaymentGateway}
        onClose={() => setShowPaymentGateway(false)}
        bookingDetails={bookingDetails}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}
