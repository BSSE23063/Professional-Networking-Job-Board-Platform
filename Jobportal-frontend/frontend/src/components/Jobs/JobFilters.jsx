import { useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import './Jobs.css';

const JobFilters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = { keyword: '', location: '', type: '' };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="filters-container">
      <form onSubmit={handleSubmit} className="filters-form">
        <div className="filters-header">
          <FaFilter className="filter-icon" />
          <h3>Find Your Dream Job</h3>
          <p>Filter jobs by keywords, location, and type</p>
        </div>
        
        <div className="filters-grid">
          <div className="form-group search-input">
            <FaSearch className="search-icon" />
            <input
              type="text"
              name="keyword"
              placeholder="Search jobs by title or description..."
              value={localFilters.keyword}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="location"
              placeholder="Location..."
              value={localFilters.location}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <select
              name="type"
              value={localFilters.type}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Remote">Remote</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>
        
        <div className="filter-actions">
          <button type="submit" className="btn btn-primary">
            Search Jobs
          </button>
          <button type="button" onClick={handleReset} className="btn btn-secondary">
            Clear Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobFilters;