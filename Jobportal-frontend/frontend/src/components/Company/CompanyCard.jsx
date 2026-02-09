import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaGlobe, FaBriefcase } from 'react-icons/fa';
import './Company.css';

const CompanyCard = ({ company }) => {
  // Get job count (you'll need to fetch this from your backend)
  const jobCount = company.jobCount || 0;

  return (
    <div className="company-card">
      <div className="company-header">
        <div className="company-logo">
          {company.logo ? (
            <img src={company.logo} alt={company.name} />
          ) : (
            <div className="company-logo-placeholder">
              {company.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="company-info">
          <h3 className="company-name">
            <Link to={`/companies/${company._id}`}>{company.name}</Link>
          </h3>
          {company.userId?.name && (
            <p className="company-owner">By {company.userId.name}</p>
          )}
        </div>
      </div>

      <div className="company-description">
        {company.description && (
          <p>
            {company.description.length > 120
              ? `${company.description.substring(0, 120)}...`
              : company.description}
          </p>
        )}
      </div>

      <div className="company-details">
        {company.location && (
          <div className="detail-item">
            <FaMapMarkerAlt />
            <span>{company.location}</span>
          </div>
        )}
        
        {company.website && (
          <div className="detail-item">
            <FaGlobe />
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="website-link"
            >
              Website
            </a>
          </div>
        )}

        <div className="detail-item">
          <FaBriefcase />
          <span>{jobCount} {jobCount === 1 ? 'Job' : 'Jobs'}</span>
        </div>
      </div>

      <div className="company-footer">
        <Link to={`/companies/${company._id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;