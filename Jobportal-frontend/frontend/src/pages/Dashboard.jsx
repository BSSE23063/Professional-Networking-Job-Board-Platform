import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  FaBriefcase,
  FaUserTie,
  FaFileAlt,
  FaBuilding,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import { jobService } from "../services/jobService";
import { applicationService } from "../services/applicationService";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      if (user.role === "candidate") {
        const applications =
          await applicationService.getCandidateApplications();
        setRecentApplications(applications.slice(0, 5));

        // Get stats for candidate
        setStats({
          totalApplications: applications.length,
          shortlisted: applications.filter(
            (app) => app.status === "shortlisted",
          ).length,
          interviews: applications.filter((app) => app.status === "interview")
            .length,
          hired: applications.filter((app) => app.status === "hired").length,
        });
      } else if (user.role === "employer") {
        const [jobsData, applicantsData] = await Promise.all([
          jobService.getJobs(),
          applicationService.getEmployerApplicants(),
        ]);

        const employerJobs = jobsData.filter(
          (job) => job.createdBy === user.id,
        );
        setRecentJobs(employerJobs.slice(0, 5));

        setStats({
          totalJobs: employerJobs.length,
          totalApplicants: applicantsData.length,
          openJobs: employerJobs.filter(
            (job) =>
              new Date(job.createdAt) >
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          ).length,
          newApplicants: applicantsData.filter(
            (app) =>
              new Date(app.createdAt) >
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          ).length,
        });
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const isCandidate = user.role === "candidate";
  const isEmployer = user.role === "employer";

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}!</h1>
        <p>Here's what's happening with your account today.</p>
      </div>

      <div className="dashboard-stats">
        {isCandidate && (
          <>
            <div className="stat-card">
              <div className="stat-icon candidate">
                <FaFileAlt />
              </div>
              <div className="stat-content">
                <h3>{stats.totalApplications || 0}</h3>
                <p>Total Applications</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon shortlisted">
                <FaUserTie />
              </div>
              <div className="stat-content">
                <h3>{stats.shortlisted || 0}</h3>
                <p>Shortlisted</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon interview">
                <FaChartLine />
              </div>
              <div className="stat-content">
                <h3>{stats.interviews || 0}</h3>
                <p>Interviews</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon hired">
                <FaBriefcase />
              </div>
              <div className="stat-content">
                <h3>{stats.hired || 0}</h3>
                <p>Hired</p>
              </div>
            </div>
          </>
        )}

        {isEmployer && (
          <>
            <div className="stat-card">
              <div className="stat-card">
                <div className="stat-icon employer">
                  <FaBriefcase />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalJobs || 0}</h3>
                  <p>Total Jobs Posted</p>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon applicants">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{stats.totalApplicants || 0}</h3>
                <p>Total Applicants</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon jobs">
                <FaBuilding />
              </div>
              <div className="stat-content">
                <h3>{stats.openJobs || 0}</h3>
                <p>Active Jobs</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon new">
                <FaChartLine />
              </div>
              <div className="stat-content">
                <h3>{stats.newApplicants || 0}</h3>
                <p>New Applicants (7 days)</p>
              </div>
            </div>
            {!user.companyName && (
              <div className="call-to-action">
                <h3>Setup Your Company</h3>
                <p>Register your company to start posting jobs</p>
                <Link to="/companies/register" className="btn btn-primary">
                  Register Company
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      <div className="dashboard-sections">
        {isCandidate && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Applications</h2>
              <Link to="/applications" className="btn btn-secondary">
                View All
              </Link>
            </div>

            {recentApplications.length === 0 ? (
              <div className="empty-state">
                <p>You haven't applied to any jobs yet.</p>
                <Link to="/jobs" className="btn btn-primary">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="applications-list">
                {recentApplications.map((application) => (
                  <div key={application._id} className="application-item">
                    <div className="application-job">
                      <h4>{application.job?.title}</h4>
                      <p>{application.job?.company?.name}</p>
                    </div>
                    <div className="application-status">
                      <span className={`status-badge ${application.status}`}>
                        {application.status}
                      </span>
                    </div>
                    <div className="application-date">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isEmployer && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Job Posts</h2>
              <Link to="/jobs?employer=true" className="btn btn-secondary">
                View All
              </Link>
            </div>

            {recentJobs.length === 0 ? (
              <div className="empty-state">
                <p>You haven't posted any jobs yet.</p>
                <Link to="/jobs/create" className="btn btn-primary">
                  Post a Job
                </Link>
              </div>
            ) : (
              <div className="jobs-list">
                {recentJobs.map((job) => (
                  <div key={job._id} className="job-item">
                    <div className="job-info">
                      <h4>{job.title}</h4>
                      <p>{job.location}</p>
                    </div>
                    <div className="job-meta">
                      <span className="job-type">{job.type}</span>
                      <span className="job-salary">{job.salary}</span>
                    </div>
                    <Link to={`/jobs/${job._id}`} className="btn btn-sm">
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="dashboard-section quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {isCandidate ? (
              <>
                <Link to="/jobs" className="action-card">
                  <FaBriefcase />
                  <span>Browse Jobs</span>
                </Link>
                <Link to="/profile" className="action-card">
                  <FaUserTie />
                  <span>Update Profile</span>
                </Link>
                <Link to="/applications" className="action-card">
                  <FaFileAlt />
                  <span>View Applications</span>
                </Link>
                <Link to="/community" className="action-card">
                  <FaUsers />
                  <span>Join Community</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/jobs/create" className="action-card">
                  <FaBriefcase />
                  <span>Post a Job</span>
                </Link>
                <Link to="/applications" className="action-card">
                  <FaUsers />
                  <span>View Applicants</span>
                </Link>
                <Link to="/profile" className="action-card">
                  <FaBuilding />
                  <span>Company Profile</span>
                </Link>
                <Link to="/community" className="action-card">
                  <FaChartLine />
                  <span>Network</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
