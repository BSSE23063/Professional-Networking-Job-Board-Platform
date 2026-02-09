// src/components/Applications/ApplicationCard.jsx
import { FaUser, FaBriefcase, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import './Applications.css';

const ApplicationCard = ({ application, userRole, onStatusUpdate }) => {
  const isEmployer = userRole === 'employer';
  const isCandidate = userRole === 'candidate';

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-purple-100 text-purple-800',
      interview: 'bg-yellow-100 text-yellow-800',
      hired: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const statusOptions = [
    { value: 'applied', label: 'Applied' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interview', label: 'Interview' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' }
  ];

  // Function to format date without date-fns
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleStatusChange = (e) => {
    onStatusUpdate(application._id, e.target.value);
  };

  return (
    <div className="application-card">
      <div className="application-header">
        {isEmployer && application.applicant && (
          <div className="applicant-info">
            <div className="applicant-avatar">
              {application.applicant.profilePic ? (
                <img src={application.applicant.profilePic} alt={application.applicant.name} />
              ) : (
                <FaUser />
              )}
            </div>
            <div>
              <h4 className="applicant-name">{application.applicant.name}</h4>
              <p className="applicant-email">{application.applicant.email}</p>
              {application.applicant.skills && (
                <div className="applicant-skills">
                  {application.applicant.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                  {application.applicant.skills.length > 3 && (
                    <span className="more-skills">+{application.applicant.skills.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {isCandidate && application.job && (
          <div className="job-info">
            <div className="job-icon">
              <FaBriefcase />
            </div>
            <div>
              <h4 className="job-title">{application.job.title}</h4>
              <p className="company-name">
                {application.job.company?.name || 'Unknown Company'}
              </p>
              <div className="job-meta">
                <span className="job-location">{application.job.location}</span>
                <span className="job-salary">{application.job.salary}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="application-details">
        {application.coverLetter && (
          <div className="cover-letter">
            <p>
              {application.coverLetter.length > 150
                ? `${application.coverLetter.substring(0, 150)}...`
                : application.coverLetter}
            </p>
          </div>
        )}

        <div className="application-meta">
          <div className="meta-item">
            <FaFileAlt />
            <a 
              href={application.resumeLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="resume-link"
            >
              View Resume
            </a>
          </div>
          <div className="meta-item">
            <FaCalendarAlt />
            <span>
              Applied {formatDate(application.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="application-footer">
        <div className="status-section">
          <span className={`status-badge ${getStatusColor(application.status)}`}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span>
        </div>

        {isEmployer && (
          <div className="status-controls">
            <select 
              value={application.status} 
              onChange={handleStatusChange}
              className="status-select"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {isCandidate && (
          <div className="application-actions">
            <a 
              href={application.resumeLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              View Resume
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;