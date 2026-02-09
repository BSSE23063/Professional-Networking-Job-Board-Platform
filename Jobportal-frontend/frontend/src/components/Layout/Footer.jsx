import { FaHeart, FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-logo">JobPortal</h3>
            <p className="footer-description">
              Connecting talented professionals with great companies worldwide.
            </p>
            <div className="footer-contact">
              <FaEnvelope />
              <span>support@jobportal.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/jobs">Find Jobs</a></li>
              <li><a href="/companies">Browse Companies</a></li>
              <li><a href="/community">Community</a></li>
              <li><a href="/about">About Us</a></li>
            </ul>
          </div>

          {/* For Job Seekers */}
          <div className="footer-section">
            <h4 className="footer-heading">For Job Seekers</h4>
            <ul className="footer-links">
              <li><a href="/jobs">Browse Jobs</a></li>
              <li><a href="/jobs?type=remote">Remote Jobs</a></li>
              <li><a href="/jobs?type=internship">Internships</a></li>
              <li><a href="/profile">Career Advice</a></li>
              <li><a href="/resume-builder">Resume Builder</a></li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="footer-section">
            <h4 className="footer-heading">For Employers</h4>
            <ul className="footer-links">
              <li><a href="/companies/register">Post a Job</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/employer-dashboard">Employer Dashboard</a></li>
              <li><a href="/hire">Hire Talent</a></li>
              <li><a href="/employer-resources">Resources</a></li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="footer-social">
          <h4 className="social-heading">Follow Us</h4>
          <div className="social-icons">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaLinkedin />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} JobPortal. All rights reserved.
          </p>
          <div className="footer-legal">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/cookies">Cookie Policy</a>
            <a href="/sitemap">Sitemap</a>
          </div>
          <p className="made-with">
            Made with <FaHeart className="heart-icon" /> by the JobPortal Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;