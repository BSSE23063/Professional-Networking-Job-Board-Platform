import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';
import { toast } from 'react-toastify';
import { 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaMoneyBillWave, 
  FaCalendarAlt,
  FaBuilding,
  FaArrowLeft,
  FaClock
} from 'react-icons/fa';
import './JobDetail.css';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resumeLink: ''
  });

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const data = await jobService.getJob(id);
      setJob(data);
    } catch (err) {
      setError('Failed to load job details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    if (user.role !== 'candidate') {
      toast.error('Only candidates can apply for jobs');
      return;
    }

    if (!applicationData.resumeLink) {
      toast.error('Please provide a resume link');
      return;
    }

    try {
      setApplying(true);
      await applicationService.applyForJob(id, applicationData);
      toast.success('Application submitted successfully!');
      navigate('/applications');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply for job');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!job) return <ErrorAlert message="Job not found" />;

  const isEmployer = user?.role === 'employer';
  const isCandidate = user?.role === 'candidate';

  return (
    <div className="job-detail-page">
      <div className="back-link">
        <Link to="/jobs" className="btn btn-secondary">
          <FaArrowLeft /> Back to Jobs
        </Link>
      </div>
      
      <div className="job-detail-container">
        <div className="job-detail-main">
          <div className="job-header">
            <div className="job-header-content">
              <h1 className="job-title">{job.title}</h1>
              
              <div className="company-info">
                <div className="company-logo-container">
                  {job.company?.logo ? (
                    <img src={job.company.logo} alt={job.company.name} className="company-logo-lg" />
                  ) : (
                    <div className="company-logo-placeholder">
                      <FaBuilding />
                    </div>
                  )}
                </div>
                <div className="company-details">
                  <h3 className="company-name">{job.company?.name}</h3>
                  <p className="company-location">
                    <FaMapMarkerAlt /> {job.company?.location || job.location}
                  </p>
                </div>
              </div>
              
              <div className="job-meta-grid">
                <div className="meta-item">
                  <div className="meta-icon">
                    <FaBriefcase />
                  </div>
                  <div className="meta-content">
                    <span className="meta-label">Job Type</span>
                    <span className="meta-value">{job.type}</span>
                  </div>
                </div>
                
                <div className="meta-item">
                  <div className="meta-icon">
                    <FaMoneyBillWave />
                  </div>
                  <div className="meta-content">
                    <span className="meta-label">Salary</span>
                    <span className="meta-value">{job.salary}</span>
                  </div>
                </div>
                
                <div className="meta-item">
                  <div className="meta-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="meta-content">
                    <span className="meta-label">Location</span>
                    <span className="meta-value">{job.location}</span>
                  </div>
                </div>
                
                <div className="meta-item">
                  <div className="meta-icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="meta-content">
                    <span className="meta-label">Posted</span>
                    <span className="meta-value">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="job-actions">
              {isCandidate && (
                <button 
                  className="btn btn-primary btn-lg" 
                  onClick={handleApply} 
                  disabled={applying}
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </button>
              )}
              {isEmployer && job.createdBy === user.id && (
                <Link to={`/applications/job/${job._id}`} className="btn btn-secondary">
                  View Applicants
                </Link>
              )}
            </div>
          </div>

          <div className="job-content">
            <div className="job-section">
              <h2>
                <span className="section-icon">📝</span>
                Job Description
              </h2>
              <div className="job-description">
                {job.description.split('\n').map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
              </div>
            </div>

            {job.requirements && (
              <div className="job-section">
                <h2>
                  <span className="section-icon">✅</span>
                  Requirements
                </h2>
                <ul className="requirements-list">
                  {job.requirements.split('\n').map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {isCandidate && (
          <div className="application-sidebar">
            <div className="application-form">
              <h3>
                <span className="form-icon">📄</span>
                Apply for this Job
              </h3>
              
              <div className="form-group">
                <label htmlFor="resumeLink">Resume Link *</label>
                <input
                  type="url"
                  id="resumeLink"
                  placeholder="https://docs.google.com/..."
                  value={applicationData.resumeLink}
                  onChange={(e) => setApplicationData(prev => ({
                    ...prev,
                    resumeLink: e.target.value
                  }))}
                  className="form-control"
                  required
                />
                <small className="help-text">
                  Provide a link to your resume (Google Drive, LinkedIn, etc.)
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="coverLetter">Cover Letter</label>
                <textarea
                  id="coverLetter"
                  placeholder="Write a cover letter to stand out..."
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData(prev => ({
                    ...prev,
                    coverLetter: e.target.value
                  }))}
                  className="form-control"
                  rows="6"
                />
              </div>

              <button 
                className="btn btn-primary btn-block" 
                onClick={handleApply}
                disabled={applying || !applicationData.resumeLink}
              >
                {applying ? (
                  <>
                    <FaClock className="loading-icon" />
                    Submitting...
                  </>
                ) : 'Submit Application'}
              </button>
            </div>

            <div className="application-tips">
              <h4>
                <span className="tips-icon">💡</span>
                Application Tips
              </h4>
              <ul>
                <li>Make sure your resume is up-to-date</li>
                <li>Customize your cover letter for this job</li>
                <li>Highlight relevant experience</li>
                <li>Check for spelling and grammar errors</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;