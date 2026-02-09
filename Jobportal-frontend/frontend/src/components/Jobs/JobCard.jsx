import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaBuilding } from 'react-icons/fa';
import './Jobs.css';

const JobCard = ({ job }) => {
  const formatSalary = (salary) => {
    if (!salary) return 'Negotiable';
    if (typeof salary === 'string' && salary.includes('-')) return salary;
    return `$${Number(salary).toLocaleString()}`;
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="company-logo">
          {job.company?.logo ? (
            <img src={job.company.logo} alt={job.company.name} />
          ) : (
            <FaBuilding className="default-logo" />
          )}
        </div>
        <div className="job-title-section">
          <h3 className="job-title">
            <Link to={`/jobs/${job._id}`}>{job.title}</Link>
          </h3>
          <p className="company-name">{job.company?.name || 'Company not specified'}</p>
        </div>
      </div>
      
      <div className="job-details">
        <div className="detail-item">
          <FaMapMarkerAlt />
          <span>{job.location}</span>
        </div>
        <div className="detail-item">
          <FaBriefcase />
          <span>{job.type}</span>
        </div>
        <div className="detail-item">
          <FaMoneyBillWave />
          <span>{formatSalary(job.salary)}</span>
        </div>
      </div>
      
      {/* <p className="job-description">
        {job.description.length > 150 
          ? `${job.description.substring(0, 150)}...` 
          : job.description}
      </p> */}
      
      <div className="job-card-footer">
        <span className="posted-date">
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;