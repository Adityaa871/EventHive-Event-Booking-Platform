import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPackageByIdApi } from '../services/api';

const PackageDetailPage = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await getPackageByIdApi(id);
        setPkg(res.data.package);
      } catch (err) {
        setError('Failed to load package details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-danger">{error || 'Package not found'}</h3>
        <Link to="/packages" className="btn btn-secondary mt-3">Back to Packages</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <Link to="/packages" className="btn btn-sm btn-outline-secondary mb-4">
        &larr; Back to Packages
      </Link>

      <div className="row g-4">
        <div className="col-md-6">
          <img
            src={pkg.image}
            alt={pkg.name}
            className="img-fluid rounded-4 shadow-sm w-100"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>

        <div className="col-md-6">
          <span className="badge bg-warning text-dark px-3 py-1 rounded-pill mb-2">
            {pkg.category}
          </span>
          <h2 className="fw-bold">{pkg.name}</h2>
          <h3 className="text-warning fw-bold my-3">${pkg.price?.toLocaleString()}</h3>
          <p className="text-secondary">{pkg.description}</p>

          <div className="d-flex gap-4 my-3 py-2 border-top border-bottom text-muted">
            <div><i className="bi bi-people-fill text-warning me-1"></i> Capacity: <strong>{pkg.capacity}</strong></div>
            <div><i className="bi bi-clock-fill text-warning me-1"></i> Duration: <strong>{pkg.duration}</strong></div>
          </div>

          <h5 className="fw-bold mt-4 mb-2">What's Included:</h5>
          <ul className="list-unstyled">
            {pkg.inclusions?.map((inc, index) => (
              <li key={index} className="mb-1 text-secondary">
                <i className="bi bi-check-circle-fill text-success me-2"></i>{inc}
              </li>
            ))}
          </ul>

          <Link to={`/book?packageId=${pkg._id}`} className="btn btn-primary-custom btn-lg mt-4 w-100 text-center">
            Book This Package
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailPage;

