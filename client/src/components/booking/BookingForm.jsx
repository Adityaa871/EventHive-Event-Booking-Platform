import { useState, useEffect } from 'react';
import { createBooking } from '../../services/bookingService';

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
  const dd = String(today.getDate() + 1).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const validate = (form) => {
  const errors = {};

  if (!form.name.trim()) errors.name = 'Name is required.';

  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!/^[6-9]\d{9}$/.test(form.phone)) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  }

  if (!form.eventType) errors.eventType = 'Event type is required.';

  if (!form.eventDate) {
    errors.eventDate = 'Event date is required.';
  } else {
    const selected = new Date(form.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected <= today) errors.eventDate = 'Event date must be a future date.';
  }

  if (!form.guestCount) {
    errors.guestCount = 'Guest count is required.';
  } else if (Number(form.guestCount) < 1) {
    errors.guestCount = 'Guest count must be at least 1.';
  }

  return errors;
};

export default function BookingForm({ packages = [], selectedPackageId = '', onSuccess }) {
  const [form, setForm] = useState({ ...initialForm, package: selectedPackageId || '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
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
        ...(form.budget && { budget: Number(form.budget) }),
        ...(form.message.trim() && { message: form.message.trim() }),
      };

      await createBooking(payload);
      setForm({ ...initialForm, package: selectedPackageId || '' });
      setErrors({});
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong. Please try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, required, children, hint }) => (
    <div className="mb-3">
      <label htmlFor={name} className="form-label fw-semibold">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {children}
      {hint && !errors[name] && <div className="form-text text-muted">{hint}</div>}
      {errors[name] && <div className="invalid-feedback d-block">{errors[name]}</div>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      {apiError && (
        <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <span>{apiError}</span>
        </div>
      )}

      <div className="row g-3">
        {/* Name */}
        <div className="col-md-6">
          <Field label="Full Name" name="name" required>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </Field>
        </div>

        {/* Email */}
        <div className="col-md-6">
          <Field label="Email Address" name="email" required>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </Field>
        </div>

        {/* Phone */}
        <div className="col-md-6">
          <Field label="Phone Number" name="phone" required hint="10-digit Indian mobile number">
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              placeholder="9876543210"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              autoComplete="tel"
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </Field>
        </div>

        {/* Package */}
        <div className="col-md-6">
          <Field label="Package" name="package">
            <select
              id="package"
              name="package"
              className="form-select"
              value={form.package}
              onChange={handleChange}
            >
              <option value="">— No specific package —</option>
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
          <Field label="Event Type" name="eventType" required>
            <select
              id="eventType"
              name="eventType"
              className={`form-select ${errors.eventType ? 'is-invalid' : ''}`}
              value={form.eventType}
              onChange={handleChange}
            >
              <option value="">— Select event type —</option>
              {eventTypes.map((et) => (
                <option key={et.value} value={et.value}>
                  {et.label}
                </option>
              ))}
            </select>
            {errors.eventType && <div className="invalid-feedback">{errors.eventType}</div>}
          </Field>
        </div>

        {/* Event Date */}
        <div className="col-md-6">
          <Field label="Event Date" name="eventDate" required>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              className={`form-control ${errors.eventDate ? 'is-invalid' : ''}`}
              value={form.eventDate}
              onChange={handleChange}
              min={getTodayString()}
            />
            {errors.eventDate && <div className="invalid-feedback">{errors.eventDate}</div>}
          </Field>
        </div>

        {/* Guest Count */}
        <div className="col-md-6">
          <Field label="Number of Guests" name="guestCount" required>
            <input
              type="number"
              id="guestCount"
              name="guestCount"
              className={`form-control ${errors.guestCount ? 'is-invalid' : ''}`}
              placeholder="50"
              value={form.guestCount}
              onChange={handleChange}
              min={1}
            />
            {errors.guestCount && <div className="invalid-feedback">{errors.guestCount}</div>}
          </Field>
        </div>

        {/* Venue */}
        <div className="col-md-6">
          <Field label="Preferred Venue" name="venue">
            <input
              type="text"
              id="venue"
              name="venue"
              className="form-control"
              placeholder="Optional venue name or area"
              value={form.venue}
              onChange={handleChange}
            />
          </Field>
        </div>

        {/* Budget */}
        <div className="col-md-6">
          <Field label="Estimated Budget (₹)" name="budget">
            <input
              type="number"
              id="budget"
              name="budget"
              className="form-control"
              placeholder="50000"
              value={form.budget}
              onChange={handleChange}
              min={0}
            />
          </Field>
        </div>

        {/* Message */}
        <div className="col-12">
          <Field label="Additional Notes" name="message">
            <textarea
              id="message"
              name="message"
              className="form-control"
              rows={4}
              placeholder="Any special requirements or notes..."
              value={form.message}
              onChange={handleChange}
            />
          </Field>
        </div>
      </div>

      <div className="d-grid mt-2">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Submitting...
            </>
          ) : (
            <>
              <i className="bi bi-calendar-check me-2"></i>
              Confirm Booking
            </>
          )}
        </button>
      </div>
    </form>
  );
}
