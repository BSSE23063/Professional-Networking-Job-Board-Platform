import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaBriefcase, FaUserTie, FaUsers } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Dream Job</h1>
          <p>Connect with top companies and discover opportunities that match your skills</p>
          <div className="hero-buttons">
            <Link to="/jobs" className="btn btn-primary btn-lg">
              <FaSearch /> Browse Jobs
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-secondary btn-lg">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose JobPortal?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaBriefcase />
              </div>
              <h3>Job Search</h3>
              <p>Find thousands of job opportunities from top companies</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaUserTie />
              </div>
              <h3>For Candidates</h3>
              <p>Upload your resume, apply to jobs, and track applications</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>For Employers</h3>
              <p>Post jobs, find talent, and manage applications easily</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to take the next step?</h2>
          <p>Join thousands of professionals and companies on JobPortal</p>
          <div className="cta-buttons">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register?role=candidate" className="btn btn-primary btn-lg">
                  Join as Candidate
                </Link>
                <Link to="/register?role=employer" className="btn btn-secondary btn-lg">
                  Hire as Employer
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;