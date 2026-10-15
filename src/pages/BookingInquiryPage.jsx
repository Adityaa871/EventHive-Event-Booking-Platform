import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getPackagesApi, submitBookingApi } from '../services/api';

const BookingInquiryPage = () => {
  const [searchParams] = useSearchParams();
  const preSelectedPackageId = searchParams.get('packageId') || '';
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    package: preSelectedPackageId,
    eventType: 'Weddings',
    eventDate: '',
    guestCount: '',
    location: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getPackagesApi({ limit: 50 })
      .then((res) => {
        setPackages(res.data.packages || []);
        if (preSelectedPackageId) {
          const matched = res.data.packages.find((p) => p._id === preSelectedPackageId);
          if (matched) {
            setFormData((prev) => ({
              ...prev,
              package: matched._id,
              eventType: matched.category,
            }));
          }
        }
      })
      .catch((err) => console.error(err));
  }, [preSelectedPackageId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await submitBookingApi(formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm p-5 max-w-600 mx-auto rounded-4">
          <div className="fs-1 text-success mb-3">🎉</div>
          <h2 className="fw-bold mb-3">Inquiry Received!</h2>
          <p className="text-secondary mb-4">
            Thank you, <strong>{formData.clientName}</strong>. Our event specialists will contact you shortly to discuss your custom proposal.
          </p>
          <button className="btn btn-primary-custom" onClick={() => navigate('/packages')}>
            Browse More Packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="max-w-700 mx-auto">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Book an Event Inquiry</h2>
          <p className="text-secondary">Fill in the details below and we will create a tailored proposal.</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="card shadow-sm p-4 rounded-4 bg-white">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Your Name *</label>
              <input
                type="text"
                name="clientName"
                className="form-control"
                required
                value={formData.clientName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Email *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Phone *</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Event Type *</label>
              <select
                name="eventType"
                className="form-select"
                value={formData.eventType}
                onChange={handleChange}
              >
                <option value="Weddings">Weddings</option>
                <option value="Corporate Events">Corporate Events</option>
                <option value="Birthdays">Birthdays</option>
                <option value="Anniversaries">Anniversaries</option>
                <option value="Concerts & Galas">Concerts & Galas</option>
                <option value="Social Gatherings">Social Gatherings</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Select Package (Optional)</label>
              <select
                name="package"
                className="form-select"
                value={formData.package}
                onChange={handleChange}
              >
                <option value="">Custom Event Inquiry (No specific package)</option>
                {packages.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} - ${p.price?.toLocaleString()} ({p.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Event Date *</label>
              <input
                type="date"
                name="eventDate"
                className="form-control"
                required
                value={formData.eventDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Estimated Guest Count *</label>
              <input
                type="number"
                name="guestCount"
                min="1"
                className="form-control"
                required
                value={formData.guestCount}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Location / City *</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. San Francisco, CA"
                className="form-control"
                required
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Additional Notes / Requests</label>
              <textarea
                name="notes"
                rows="3"
                className="form-control"
                placeholder="Special themes, dietary preferences, or sound requirements..."
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-12 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary-custom w-100 py-3 fw-bold"
              >
                {loading ? 'Submitting...' : 'Send Inquiry'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingInquiryPage;

