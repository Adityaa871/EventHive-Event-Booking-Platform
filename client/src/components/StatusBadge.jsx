import React from 'react';

const StatusBadge = ({ status }) => {
  const normalized = (status || 'new').toLowerCase();

  switch (normalized) {
    case 'new':
      return (
        <span className="badge bg-warning text-dark px-2.5 py-1.5 rounded-pill fw-semibold">
          <i className="bi bi-bell-fill me-1"></i> New Lead
        </span>
      );
    case 'contacted':
      return (
        <span className="badge bg-info text-dark px-2.5 py-1.5 rounded-pill fw-semibold">
          <i className="bi bi-telephone-outbound-fill me-1"></i> Contacted
        </span>
      );
    case 'confirmed':
      return (
        <span className="badge bg-success text-white px-2.5 py-1.5 rounded-pill fw-semibold">
          <i className="bi bi-check-circle-fill me-1"></i> Confirmed
        </span>
      );
    case 'cancelled':
      return (
        <span className="badge bg-secondary text-white px-2.5 py-1.5 rounded-pill fw-semibold">
          <i className="bi bi-x-circle-fill me-1"></i> Cancelled
        </span>
      );
    default:
      return (
        <span className="badge bg-light text-dark px-2.5 py-1.5 rounded-pill">
          {status}
        </span>
      );
  }
};

export default StatusBadge;

