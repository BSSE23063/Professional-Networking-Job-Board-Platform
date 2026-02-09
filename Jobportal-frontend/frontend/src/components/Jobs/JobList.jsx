import { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import JobCard from './JobCard';
import JobFilters from './JobFilters';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';
import './Jobs.css';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    type: ''
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getJobs(filters);
      setJobs(data);
      setError('');
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="job-list">
      <div className="filters-section">
        <JobFilters filters={filters} onFilterChange={handleFilterChange} />
      </div>
      
      <div className="job-content">
        {jobs.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No jobs found</h3>
            <p>Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <div className="job-count">
              <h4>Available Jobs</h4>
              <p>Found {jobs.length} job{jobs.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="jobs-grid">
              {jobs.map(job => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JobList;