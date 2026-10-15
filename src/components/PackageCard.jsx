import React from 'react';
import { Link } from 'react-router-dom';

const PackageCard = ({ pkg }) => {
  return (
    <div className="card card-package h-100 position-relative d-flex flex-column">
      <div className="position-relative overflow-hidden">
        <img
          src={pkg.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'}
          alt={pkg.name}
          className="card-package-img"
          loading="lazy"
        />
        <span className="badge-category">{pkg.category}</span>
        {pkg.featured && <span className="badge-featured">⭐ Featured</span>}
      </div>

      <div className="card-body p-4 d-flex flex-column flex-grow-1">
        <div className="d-flex justify-content-between align-items-baseline mb-2">
          <h5 className="card-title fw-bold mb-0 text-dark">{pkg.name}</h5>
        </div>

        <div className="d-flex align-items-baseline gap-2 mb-3">
          <span className="fs-3 fw-extrabold text-warning text-dark-emphasis">
            ${pkg.price?.toLocaleString()}
          </span>
          <span className="text-muted small">/ event</span>
        </div>

        <p className="card-text text-secondary small mb-3 flex-grow-1">
          {pkg.description?.length > 115
            ? `${pkg.description.substring(0, 115)}...`
            : pkg.description}
        </p>

        <div className="d-flex justify-content-between align-items-center py-2 mb-3 border-top border-bottom border-light-subtle text-muted small">
          <span className="d-flex align-items-center gap-1">
            <i className="bi bi-people-fill text-warning"></i>
            Up to <strong>{pkg.capacity}</strong> guests
          </span>
          <span className="d-flex align-items-center gap-1">
            <i className="bi bi-clock-history text-warning"></i>
            {pkg.duration}
          </span>
        </div>

        <div className="mb-3">
          <div className="text-muted small fw-semibold mb-1">Key Inclusions:</div>
          <ul className="list-unstyled mb-0 small text-secondary">
            {pkg.inclusions?.slice(0, 2).map((inc, i) => (
              <li key={i} className="text-truncate d-flex align-items-center gap-1">
                <i className="bi bi-check-circle-fill text-success fs-6"></i>
                <span>{inc}</span>
              </li>
            ))}
            {pkg.inclusions?.length > 2 && (
              <li className="text-muted fst-italic">
                + {pkg.inclusions.length - 2} more premium features
              </li>
            )}
          </ul>
        </div>

        <div className="mt-auto d-flex gap-2">
          <Link
            to={`/packages/${pkg._id}`}
            className="btn btn-outline-dark btn-sm flex-fill rounded-pill py-2 fw-semibold"
          >
            Details
          </Link>
          <Link
            to={`/book?packageId=${pkg._id}`}
            className="btn btn-primary-custom btn-sm flex-fill text-center py-2 fw-semibold"
          >
            Book Inquiry
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;

