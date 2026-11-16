import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas)' }}>
      <AdminSidebar />

      <main className="flex-grow-1 p-4 p-lg-5">
        {/* Header */}
        <div className="mb-4">
          <div className="mb-2">
            <Link to="/admin/packages" className="text-secondary small text-decoration-none">
              ← Back to packages
            </Link>
          </div>
          <h1 className="h4 fw-bold tracking-tight mb-1">
            {isEditMode ? 'Edit Package' : 'Create New Package'}
          </h1>
          <p className="text-secondary small mb-0">
            {isEditMode
              ? 'Update the package details, pricing, and inclusions below.'
              : 'Fill in the specifications to add a new event package to your catalog.'}
          </p>
        </div>

        {loadingPackage ? (
          <div className="p-5 text-center">
            <Loader />
          </div>
        ) : fetchError ? (
          <ErrorMessage message={fetchError} />
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-4">
              {/* Left Column — Package Details */}
              <div className="col-12 col-lg-8">
                <div
                  className="card-tactile overflow-hidden mb-4"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div
                    className="p-3 px-4 border-bottom fw-bold small text-uppercase"
                    style={{
                      letterSpacing: '0.04em',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    Package Information
                  </div>
                  <div className="p-4">
                    {submitError && (
                      <div className="alert alert-danger py-2 px-3 small mb-4">{submitError}</div>
                    )}

                    {/* Title */}
                    <div className="mb-3">
                      <label className="form-label">
                        Package Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        className={`form-control ${fieldErrors.title ? 'is-invalid' : ''}`}
                        placeholder="e.g. Royal Wedding Reception"
                        value={formData.title}
                        onChange={handleChange}
                      />
                      {renderFieldError('title')}
                    </div>

                    {/* Category */}
                    <div className="mb-3">
                      <label className="form-label">
                        Category <span className="text-danger">*</span>
                      </label>
                      <select
                        name="category"
                        className={`form-select ${fieldErrors.category ? 'is-invalid' : ''}`}
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="">Select an occasion category…</option>
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
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label mb-0">
                          Short Summary Tagline <span className="text-danger">*</span>
                        </label>
                        <span className="text-muted small">
                          {formData.shortDescription.length}/200
                        </span>
                      </div>
                      <input
                        type="text"
                        name="shortDescription"
                        className={`form-control ${fieldErrors.shortDescription ? 'is-invalid' : ''}`}
                        placeholder="A concise one-line highlight for cards and previews"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        maxLength={200}
                      />
                      {renderFieldError('shortDescription')}
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <label className="form-label">
                        Full Description <span className="text-danger">*</span>
                      </label>
                      <textarea
                        name="description"
                        rows={5}
                        className={`form-control ${fieldErrors.description ? 'is-invalid' : ''}`}
                        placeholder="Detailed narrative describing the experience, flow, and venue arrangement…"
                        value={formData.description}
                        onChange={handleChange}
                      />
                      {renderFieldError('description')}
                    </div>

                    {/* Inclusions */}
                    <div className="mb-3">
                      <label className="form-label">
                        Inclusions & Services
                        <span className="text-muted small ms-2 fw-normal">
                          (comma-separated)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="inclusions"
                        className="form-control"
                        placeholder="e.g. Venue Styling, 4-Course Catering, Candid Photography, Sound System"
                        value={formData.inclusions}
                        onChange={handleChange}
                      />
                      <div className="form-text">
                        Separate each deliverable item with a comma.
                      </div>
                    </div>

                    {/* Images */}
                    <div className="mb-0">
                      <label className="form-label">
                        Image URLs
                        <span className="text-muted small ms-2 fw-normal">
                          (comma-separated)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="images"
                        className="form-control"
                        placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
                        value={formData.images}
                        onChange={handleChange}
                      />
                      <div className="form-text">Paste full HTTPS image URLs, separated by commas.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column — Pricing, Parameters & Settings */}
              <div className="col-12 col-lg-4">
                {/* Pricing & Logistics */}
                <div
                  className="card-tactile overflow-hidden mb-4"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div
                    className="p-3 px-4 border-bottom fw-bold small text-uppercase"
                    style={{
                      letterSpacing: '0.04em',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    Pricing & Logistics
                  </div>
                  <div className="p-4">
                    {/* Price */}
                    <div className="mb-3">
                      <label className="form-label">
                        Price (₹ INR) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        min="0"
                        step="0.01"
                        className={`form-control ${fieldErrors.price ? 'is-invalid' : ''}`}
                        placeholder="e.g. 75000"
                        value={formData.price}
                        onChange={handleChange}
                      />
                      {renderFieldError('price')}
                    </div>

                    {/* Capacity */}
                    <div className="mb-3">
                      <label className="form-label">Guest Capacity</label>
                      <input
                        type="number"
                        name="capacity"
                        min="0"
                        className={`form-control ${fieldErrors.capacity ? 'is-invalid' : ''}`}
                        placeholder="e.g. 150"
                        value={formData.capacity}
                        onChange={handleChange}
                      />
                      {renderFieldError('capacity')}
                    </div>

                    {/* Duration */}
                    <div className="mb-0">
                      <label className="form-label">Event Duration</label>
                      <input
                        type="text"
                        name="duration"
                        className="form-control"
                        placeholder="e.g. 6 hours, Full day"
                        value={formData.duration}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Catalog Settings */}
                <div
                  className="card-tactile overflow-hidden mb-4"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div
                    className="p-3 px-4 border-bottom fw-bold small text-uppercase"
                    style={{
                      letterSpacing: '0.04em',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    Catalog Settings
                  </div>
                  <div className="p-4">
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                      />
                      <label className="form-check-label fw-semibold text-dark" htmlFor="isFeatured">
                        Featured Package
                      </label>
                      <div className="form-text">Display in the curated highlight strip on the homepage.</div>
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
                      <label className="form-check-label fw-semibold text-dark" htmlFor="isActive">
                        Active in Catalog
                      </label>
                      <div className="form-text">When unchecked, package is hidden from client searches.</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-tactile py-2 fw-semibold"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        {isEditMode ? 'Updating…' : 'Saving…'}
                      </>
                    ) : isEditMode ? (
                      'Update Package'
                    ) : (
                      'Create Package'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-tactile py-2"
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
