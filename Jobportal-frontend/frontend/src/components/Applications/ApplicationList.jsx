import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/applicationService';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';
import ApplicationCard from './ApplicationCard';
import './Applications.css';

const ApplicationList = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let data;
      
      if (user.role === 'candidate') {
        data = await applicationService.getCandidateApplications();
      } else if (user.role === 'employer') {
        data = await applicationService.getEmployerApplicants();
      }
      
      setApplications(data);
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, status);
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status } : app
      ));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  const isCandidate = user.role === 'candidate';
  const isEmployer = user.role === 'employer';

  return (
    <div className="application-list">
      <div className="application-header">
        <h1>
          {isCandidate ? 'My Applications' : 'Job Applicants'}
        </h1>
        <p className="subtitle">
          {isCandidate 
            ? `You have applied for ${applications.length} jobs`
            : `You have ${applications.length} total applicants`
          }
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="no-applications">
          <h3>No applications found</h3>
          <p>
            {isCandidate 
              ? "You haven't applied to any jobs yet. Browse jobs to get started!"
              : "No one has applied to your jobs yet."
            }
          </p>
        </div>
      ) : (
        <>
          <div className="application-filters">
            <div className="stats">
              <div className="stat">
                <span className="stat-count">
                  {applications.filter(app => app.status === 'applied').length}
                </span>
                <span className="stat-label">Applied</span>
              </div>
              <div className="stat">
                <span className="stat-count">
                  {applications.filter(app => app.status === 'shortlisted').length}
                </span>
                <span className="stat-label">Shortlisted</span>
              </div>
              <div className="stat">
                <span className="stat-count">
                  {applications.filter(app => app.status === 'interview').length}
                </span>
                <span className="stat-label">Interview</span>
              </div>
              <div className="stat">
                <span className="stat-count">
                  {applications.filter(app => app.status === 'hired').length}
                </span>
                <span className="stat-label">Hired</span>
              </div>
            </div>
          </div>

          <div className="applications-grid">
            {applications.map(application => (
              <ApplicationCard
                key={application._id}
                application={application}
                userRole={user.role}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicationList;