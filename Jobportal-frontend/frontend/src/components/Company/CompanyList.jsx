import { useState, useEffect } from 'react';
import { companyService } from '../../services/companyService';
import CompanyCard from './CompanyCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';
// import SearchBar from '../Common/SearchBar';
import './Company.css';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await companyService.getCompanies();
      setCompanies(data);
    } catch (err) {
      setError('Failed to load companies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="company-list">
      <div className="company-header">
        <h1>Top Companies</h1>
        <p>Discover great companies to work for</p>
      </div>

      <div className="search-section">
        <input
          type="text" 
          placeholder="Search companies by name, location, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <div className="company-count">
          Showing {filteredCompanies.length} of {companies.length} companies
        </div>
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="no-companies">
          <h3>No companies found</h3>
          <p>Try adjusting your search query</p>
        </div>
      ) : (
        <div className="companies-grid">
          {filteredCompanies.map(company => (
            <CompanyCard key={company._id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyList;