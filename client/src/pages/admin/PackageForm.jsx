import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { createPackage, updatePackage, getPackageById } from '../../services/packageService';

const CATEGORIES = ['birthday', 'wedding', 'corporate', 'anniversary', 'other'];

const EMPTY_FORM = {
  title: '',
  category: '',
  shortDescription: '',
  description: '',
  price: '',
  capacity: '',
  duration: '',
  inclusions: '',
  images: '',
  isFeatured: false,
  isActive: true,
};

const PackageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loadingPackage, setLoadingPackage] = useState(isEditMode);
  const [fetchError, setFetchError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Fetch existing package in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchPackage = async () => {
      try {
        setLoadingPackage(true);
        setFetchError('');
        const pkg = await getPackageById(id);
        setFormData({
          title: pkg.title || '',
          category: pkg.category || '',
          shortDescription: pkg.shortDescription || '',
          description: pkg.description || '',
          price: pkg.price != null ? String(pkg.price) : '',
          capacity: pkg.capacity != null ? String(pkg.capacity) : '',
          duration: pkg.duration || '',
          inclusions: Array.isArray(pkg.inclusions)
            ? pkg.inclusions.join(', ')
            : pkg.inclusions || '',
          images: Array.isArray(pkg.images)
            ? pkg.images.join(', ')
            : pkg.images || '',
          isFeatured: pkg.isFeatured || false,
          isActive: pkg.isActive !== false,
        });
      } catch (err) {
        setFetchError(err?.response?.data?.message || 'Failed to load package.');
      } finally {
        setLoadingPackage(false);
      }
    };

    fetchPackage();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required.';
    if (!formData.category) errors.category = 'Category is required.';
    if (!formData.shortDescription.trim())
      errors.shortDescription = 'Short description is required.';
    if (formData.shortDescription.length > 200)
      errors.shortDescription = 'Short description must be under 200 characters.';
    if (!formData.description.trim()) errors.description = 'Description is required.';
    if (!formData.price && formData.price !== 0) {
      errors.price = 'Price is required.';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      errors.price = 'Price must be a valid positive number.';
    }
    if (formData.capacity && (isNaN(Number(formData.capacity)) || Number(formData.capacity) < 0)) {
      errors.capacity = 'Capacity must be a valid positive number.';
    }
    return errors;
  };

  const buildPayload = () => {
    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      isFeatured: formData.isFeatured,
      isActive: formData.isActive,
    };

    if (formData.capacity !== '') payload.capacity = Number(formData.capacity);
    if (formData.duration.trim()) payload.duration = formData.duration.trim();

    payload.inclusions = formData.inclusions
      ? formData.inclusions
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    payload.images = formData.images
      ? formData.images
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload = buildPayload();

    try {
      setSubmitting(true);
      if (isEditMode) {
        await updatePackage(id, payload);
      } else {
        await createPackage(payload);
      }
      navigate('/admin/packages', { replace: true });
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || 'Failed to save package. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderFieldError = (field) =>
    fieldErrors[field] ? (
      <div className="invalid-feedback d-block">{fieldErrors[field]}</div>
    ) : null;

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <AdminSidebar />

      <main className="flex-grow-1 p-4">
        {/* Header */}
        <div className="mb-4">
          <h4 className="fw-bold mb-0" style={{ color: '#0d1b2a' }}>
            {isEditMode ? '✏️ Edit Package' : '➕ New Package'}
          </h4>
          <p className="text-muted small mb-0">
            {isEditMode ? 'Update the package details below.' : 'Fill in the details to create a new event package.'}
          </p>
        </div>

        {loadingPackage ? (
          <Loader />
        ) : fetchError ? (
          <ErrorMessage message={fetchError} />
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-4">
              {/* Left Column */}
              <div className="col-12 col-lg-8">
                <div className="card border-0 shadow-sm mb-4">
                  <div
                    className="card-header border-0 fw-semibold"
                    style={{ background: '#0d1b2a', color: '#f5a623' }}
                  >
                    📝 Package Information
                  </div>
                  <div className="card-body p-4">
                    {submitError && (
                      <div className="alert alert-danger py-2 px-3 small">{submitError}</div>
                    )}

                    {/* Title */}
                    <div className="mb-3">
                      <label className="form-label fw-medium">
                        Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        className={`form-control ${fieldErrors.title ? 'is-invalid' : ''}`}
                        placeholder="e.g. Royal Wedding Package"
                        value={formData.title}
                        onChange={handleChange}
                      />
                      {renderFieldError('title')}
                    </div>

                    {/* Category */}
                    <div className="mb-3">
                      <label className="form-label fw-medium">
                        Category <span className="text-danger">*</span>
                      </label>
                      <select
                        name="category"
                        className={`form-select ${fieldErrors.category ? 'is-invalid' : ''}`}
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="">Select a category…</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat} className="text-capitalize">
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                      {renderFieldError('category')}
                    </div>

                    {/* Short Description */}
                    <div className="mb-3">
                      <label className="form-label fw-medium">
                        Short Description <span className="text-danger">*</span>
                        <span className="text-muted small ms-2 fw-normal">
                          ({formData.shortDescription.length}/200)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="shortDescription"
                        className={`form-control ${fieldErrors.shortDescription ? 'is-invalid' : ''}`}
                        placeholder="A brief tagline for the package"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        maxLength={200}
                      />
                      {renderFieldError('shortDescription')}
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <label className="form-label fw-medium">
                        Full Description <span className="text-danger">*</span>
                      </label>
                      <textarea
                        name="description"
                        rows={5}
                        className={`form-control ${fieldErrors.description ? 'is-invalid' : ''}`}
                        placeholder="Detailed description of the package…"
                        value={formData.description}
                        onChange={handleChange}
                      />
                      {renderFieldError('description')}
                    </div>

                    {/* Inclusions */}
                    <div className="mb-3">
                      <label className="form-label fw-medium">
                        Inclusions
                        <span className="text-muted small ms-2 fw-normal">
                          (comma-separated)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="inclusions"
                        className="form-control"
                        placeholder="e.g. Decoration, Catering, Photography"
                        value={formData.inclusions}
                        onChange={handleChange}
                      />
                      <div className="form-text">
                        Separate each inclusion with a comma.
                      </div>
                    </div>

                    {/* Images */}
                    <div className="mb-0">
                      <label className="form-label fw-medium">
                        Image URLs
                        <span className="text-muted small ms-2 fw-normal">
                          (comma-separated)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="images"
                        className="form-control"
                        placeholder="https://…, https://…"
                        value={formData.images}
                        onChange={handleChange}
                      />
                      <div className="form-text">Paste full image URLs, separated by commas.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-12 col-lg-4">
                {/* Pricing & Details */}
                <div className="card border-0 shadow-sm mb-4">
                  <div
                    className="card-header border-0 fw-semibold"
                    style={{ background: '#0d1b2a', color: '#f5a623' }}
                  >
                    💰 Pricing & Details
                  </div>
                  <div className="card-body p-4">
                    {/* Price */}
                    <div className="mb-3">
                      <label className="form-label fw-medium">
                        Price (₹) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        min="0"
                        step="0.01"
                        className={`form-control ${fieldErrors.price ? 'is-invalid' : ''}`}
                        placeholder="e.g. 50000"
                        value={formData.price}
                        onChange={handleChange}
                      />
                      {renderFieldError('price')}
                    </div>

                    {/* Capacity */}
                    <div className="mb-3">
                      <label className="form-label fw-medium">Capacity</label>
                      <input
                        type="number"
                        name="capacity"
                        min="0"
                        className={`form-control ${fieldErrors.capacity ? 'is-invalid' : ''}`}
                        placeholder="e.g. 100"
                        value={formData.capacity}
                        onChange={handleChange}
                      />
                      {renderFieldError('capacity')}
                    </div>

                    {/* Duration */}
                    <div className="mb-0">
                      <label className="form-label fw-medium">Duration</label>
                      <input
                        type="text"
                        name="duration"
                        className="form-control"
                        placeholder="e.g. 4 hours, Full day"
                        value={formData.duration}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="card border-0 shadow-sm mb-4">
                  <div
                    className="card-header border-0 fw-semibold"
                    style={{ background: '#0d1b2a', color: '#f5a623' }}
                  >
                    ⚙️ Settings
                  </div>
                  <div className="card-body p-4">
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                      />
                      <label className="form-check-label fw-medium" htmlFor="isFeatured">
                        ⭐ Featured Package
                      </label>
                      <div className="form-text">Show on homepage featured section.</div>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                      />
                      <label className="form-check-label fw-medium" htmlFor="isActive">
                        ✅ Active
                      </label>
                      <div className="form-text">Inactive packages are hidden from clients.</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn fw-semibold py-2"
                    style={{ background: '#f5a623', color: '#0d1b2a', border: 'none' }}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        {isEditMode ? 'Updating…' : 'Creating…'}
                      </>
                    ) : isEditMode ? (
                      '💾 Update Package'
                    ) : (
                      '✅ Create Package'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/admin/packages')}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default PackageForm;
