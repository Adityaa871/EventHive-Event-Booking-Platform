import React, { useState, useEffect } from 'react';
import {
  getPackagesApi,
  createPackageApi,
  updatePackageApi,
  deletePackageApi,
} from '../../services/api';

const AdminPackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const initialForm = {
    name: '',
    category: 'Weddings',
    price: '',
    duration: '',
    capacity: '',
    description: '',
    inclusions: '',
    image: '',
    featured: false,
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const res = await getPackagesApi({ limit: 100 });
      setPackages(res.data.packages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingPackage(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      category: pkg.category,
      price: pkg.price,
      duration: pkg.duration,
      capacity: pkg.capacity,
      description: pkg.description,
      inclusions: pkg.inclusions?.join(', ') || '',
      image: pkg.image || '',
      featured: pkg.featured || false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event package?')) {
      try {
        await deletePackageApi(id);
        loadPackages();
      } catch (err) {
        alert('Failed to delete package');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        capacity: Number(formData.capacity),
        inclusions: formData.inclusions.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingPackage) {
        await updatePackageApi(editingPackage._id, payload);
      } else {
        await createPackageApi(payload);
      }

      setShowModal(false);
      loadPackages();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save package');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Manage Event Packages</h2>
          <p className="text-secondary small mb-0">Create, edit, and organize client event offerings</p>
        </div>
        <button className="btn btn-warning text-dark fw-bold" onClick={handleOpenAdd}>
          <i className="bi bi-plus-lg me-1"></i> Add New Package
        </button>
      </div>

      <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr className="text-muted small">
                  <th>Image</th>
                  <th>Name & Category</th>
                  <th>Price</th>
                  <th>Capacity</th>
                  <th>Duration</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg._id}>
                    <td>
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        style={{ width: '56px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                    </td>
                    <td>
                      <div className="fw-bold">{pkg.name}</div>
                      <span className="badge bg-light text-dark">{pkg.category}</span>
                    </td>
                    <td className="fw-semibold">${pkg.price?.toLocaleString()}</td>
                    <td>{pkg.capacity} guests</td>
                    <td>{pkg.duration}</td>
                    <td>{pkg.featured ? <span className="text-warning fw-bold">★ Yes</span> : 'No'}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleOpenEdit(pkg)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(pkg._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Simple Add/Edit Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <form onSubmit={handleSubmit}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">
                    {editingPackage ? 'Edit Package' : 'Create New Event Package'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Package Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Category *</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Weddings">Weddings</option>
                        <option value="Corporate Events">Corporate Events</option>
                        <option value="Birthdays">Birthdays</option>
                        <option value="Anniversaries">Anniversaries</option>
                        <option value="Concerts & Galas">Concerts & Galas</option>
                        <option value="Social Gatherings">Social Gatherings</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Price ($) *</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Duration *</label>
                      <input
                        type="text"
                        placeholder="e.g. 6 Hours"
                        className="form-control"
                        required
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Guest Capacity *</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        required
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Description *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">
                        Inclusions (comma separated) *
                      </label>
                      <input
                        type="text"
                        placeholder="Floral arch, 3-course dinner, DJ sound, Photography"
                        className="form-control"
                        required
                        value={formData.inclusions}
                        onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://..."
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="featuredCheck"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        />
                        <label className="form-check-label small" htmlFor="featuredCheck">
                          Feature this package on the homepage
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning text-dark fw-bold">
                    Save Package
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

export default AdminPackagesPage;

