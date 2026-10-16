import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPackagesApi } from '../services/api';
import PackageCard from '../components/PackageCard';

const PackagesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Weddings',
    'Corporate Events',
    'Birthdays',
    'Anniversaries',
    'Concerts & Galas',
    'Social Gatherings',
  ];

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    fetchPackages();
  }, [selectedCategory, searchQuery]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await getPackagesApi(params);
      setPackages(res.data.packages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="text-center mb-4">
          <h1 className="fw-bold">All Event Packages</h1>
          <p className="text-secondary">Discover tailored packages for every occasion and guest size</p>
        </div>

        {/* Search and Filters */}
        <div className="card border-0 shadow-sm p-3 mb-4 rounded-4 bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search package name or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-md-6 d-flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`btn btn-sm rounded-pill ${
                    selectedCategory === cat ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'
                  }`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm">
            <h4 className="fw-bold text-muted">No packages found</h4>
            <p className="text-secondary">Try searching for something else or clearing filters.</p>
          </div>
        ) : (
          <div className="row g-4">
            {packages.map((pkg) => (
              <div key={pkg._id} className="col-lg-4 col-md-6">
                <PackageCard pkg={pkg} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;

