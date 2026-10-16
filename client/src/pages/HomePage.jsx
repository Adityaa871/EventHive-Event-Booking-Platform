import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPackagesApi } from '../services/api';
import PackageCard from '../components/PackageCard';

const HomePage = () => {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getPackagesApi({ featured: true, limit: 3 });
        setFeaturedPackages(res.data.packages || []);
      } catch (err) {
        console.error('Error fetching featured packages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Weddings', icon: '💍', desc: 'Bespoke ceremonies and regal receptions' },
    { name: 'Corporate Events', icon: '💼', desc: 'Executive summits, galas & activations' },
    { name: 'Birthdays', icon: '🎂', desc: 'Themed jubilee celebrations & sweet milestones' },
    { name: 'Anniversaries', icon: '🥂', desc: 'Silver, golden & romantic anniversary soirees' },
    { name: 'Concerts & Galas', icon: '🎭', desc: 'Line arrays, pro staging & outdoor festivals' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-5 position-relative">
        <div className="container py-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold text-uppercase mb-3">
                ✨ Premier Event Management
              </span>
              <h1 className="display-5 fw-bold mb-3 text-white">
                Creating Moments That <span className="text-warning">Echo Forever</span>
              </h1>
              <p className="lead text-light opacity-75 mb-4">
                From luxury weddings to premier corporate summits, EventHive orchestrates breathtaking events with seamless design, turnkey production, and dedicated coordination.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/packages" className="btn btn-primary-custom btn-lg">
                  Explore Packages
                </Link>
                <Link to="/book" className="btn btn-outline-light btn-lg rounded-pill">
                  Submit Booking Inquiry
                </Link>
              </div>
            </div>
            <div className="col-lg-5 text-center d-none d-lg-block">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80"
                alt="Event Celebration"
                className="img-fluid rounded-4 shadow"
                style={{ maxHeight: '350px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold">Browse By Event Type</h2>
            <p className="text-secondary">Choose the celebration style tailored to your vision</p>
          </div>
          <div className="row g-3">
            {categories.map((cat, idx) => (
              <div key={idx} className="col">
                <Link
                  to={`/packages?category=${encodeURIComponent(cat.name)}`}
                  className="card h-100 text-decoration-none border text-center p-3 rounded-3 shadow-sm hover-shadow"
                >
                  <div className="fs-2 mb-2">{cat.icon}</div>
                  <h6 className="fw-bold text-dark mb-1">{cat.name}</h6>
                  <p className="text-muted small mb-0">{cat.desc}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-0">Featured Packages</h2>
              <p className="text-secondary small mb-0">Handpicked event packages ready for reservation</p>
            </div>
            <Link to="/packages" className="btn btn-outline-dark btn-sm rounded-pill">
              View All &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredPackages.map((pkg) => (
                <div key={pkg._id} className="col-md-4">
                  <PackageCard pkg={pkg} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

