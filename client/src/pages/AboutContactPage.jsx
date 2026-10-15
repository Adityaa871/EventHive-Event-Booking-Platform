import React from 'react';
import { Link } from 'react-router-dom';

const AboutContactPage = () => {
  return (
    <div className="container py-5">
      <div className="max-w-700 mx-auto text-center mb-5">
        <h1 className="fw-bold">About EventHive</h1>
        <p className="lead text-secondary">
          We bring extraordinary events to life with passion, creativity, and flawless execution.
        </p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card h-100 p-4 border-0 shadow-sm rounded-4 text-center">
            <div className="fs-1 text-warning mb-2">🎯</div>
            <h5 className="fw-bold">Our Mission</h5>
            <p className="text-secondary small">
              To remove the friction from event planning by offering transparent, all-inclusive packages and dedicated event management.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 p-4 border-0 shadow-sm rounded-4 text-center">
            <div className="fs-1 text-warning mb-2">💎</div>
            <h5 className="fw-bold">Quality Standard</h5>
            <p className="text-secondary small">
              We vet every vendor, musician, caterer, and technician so you can be confident your guests experience five-star hospitality.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 p-4 border-0 shadow-sm rounded-4 text-center">
            <div className="fs-1 text-warning mb-2">🤝</div>
            <h5 className="fw-bold">Client First</h5>
            <p className="text-secondary small">
              Your vision guides every detail. We offer end-to-end support from initial inquiry to final encore.
            </p>
          </div>
        </div>
      </div>

      <div className="card shadow-sm p-4 rounded-4 bg-white max-w-700 mx-auto">
        <h4 className="fw-bold mb-3">Contact Information</h4>
        <div className="d-flex flex-column gap-3 text-secondary">
          <div><i className="bi bi-geo-alt-fill text-warning me-2"></i> 100 Innovation Way, Suite 400, San Francisco, CA</div>
          <div><i className="bi bi-telephone-fill text-warning me-2"></i> +1 (800) 555-HIVE (4483)</div>
          <div><i className="bi bi-envelope-fill text-warning me-2"></i> inquiries@eventhive.com</div>
          <div><i className="bi bi-clock-fill text-warning me-2"></i> Monday - Saturday: 9:00 AM - 7:00 PM PST</div>
        </div>
        <div className="mt-4">
          <Link to="/book" className="btn btn-primary-custom">
            Send an Inquiry
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutContactPage;

