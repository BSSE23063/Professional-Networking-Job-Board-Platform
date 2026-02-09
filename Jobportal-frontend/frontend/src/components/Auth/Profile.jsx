import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ErrorBoundary from '../Common/ErrorBoundary';
import LoadingSpinner from '../Common/LoadingSpinner';
import { 
  FaUser, 
  FaBuilding, 
  FaEnvelope, 
  FaBriefcase, 
  FaGlobe,
  FaLink,
  FaEdit,
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaSignInAlt
} from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    skills: '',
    companyName: '',
    companyWebsite: '',
    resume: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Initialize form with user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        skills: user.skills?.join(', ') || '',
        companyName: user.companyName || '',
        companyWebsite: user.companyWebsite || '',
        resume: user.resume || ''
      });
    }
  }, [user]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (user?.role === 'employer' && !formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (formData.companyWebsite && !/^https?:\/\/.+/.test(formData.companyWebsite)) {
      newErrors.companyWebsite = 'Please enter a valid URL (https://)';
    }
    
    if (formData.resume && !/^https?:\/\/.+/.test(formData.resume)) {
      newErrors.resume = 'Please enter a valid URL (https://)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setSaving(true);

    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        bio: formData.bio.trim(),
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      };

      // Add role-specific fields
      if (user?.role === 'employer') {
        userData.companyName = formData.companyName.trim();
        if (formData.companyWebsite.trim()) {
          userData.companyWebsite = formData.companyWebsite.trim();
        }
      } else if (user?.role === 'candidate' && formData.resume.trim()) {
        userData.resume = formData.resume.trim();
      }

      const result = await updateProfile(userData);
      
      if (result.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      skills: user?.skills?.join(', ') || '',
      companyName: user?.companyName || '',
      companyWebsite: user?.companyWebsite || '',
      resume: user?.resume || ''
    });
    setErrors({});
  };

  if (!user) return <LoadingSpinner />;

  const isCandidate = user.role === 'candidate';
  const isEmployer = user.role === 'employer';

  return (
    <ErrorBoundary message="Unable to load profile page">
      <div className="profile-page">
        <div className="auth-container">
          {/* Left side - Info */}
          {/* <div className="auth-info-side">
            <div className="auth-logo">
              <h1>JobPortal</h1>
              <p className="tagline">Your career journey starts here</p>
            </div>
            
            <div className="auth-features">
              <div className="feature">
                <div className="feature-icon">
                  {isCandidate ? <FaUser /> : <FaBuilding />}
                </div>
                <div>
                  <h3>{isCandidate ? 'Candidate Profile' : 'Company Profile'}</h3>
                  <p>
                    {isCandidate 
                      ? 'Update your skills and experience to attract employers'
                      : 'Manage your company information for job postings'
                    }
                  </p>
                </div>
              </div>
              
              <div className="feature">
                <div className="feature-icon">
                  <FaEdit />
                </div>
                <div>
                  <h3>Easy Updates</h3>
                  <p>Edit your profile anytime to stay current</p>
                </div>
              </div>
              
              <div className="feature">
                <div className="feature-icon">
                  <FaSignInAlt />
                </div>
                <div>
                  <h3>Account Management</h3>
                  <p>All your information in one place</p>
                </div>
              </div>
            </div>
            
            <div className="stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Active Jobs</span>
              </div>
              <div className="stat">
                <span className="stat-number">5K+</span>
                <span className="stat-label">Companies</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
            
            <Link to="/dashboard" className="back-to-dashboard">
              <FaArrowLeft />
              <span>Back to Dashboard</span>
            </Link>
          </div> */}

          {/* Right side - Form */}
          <div className="auth-form-side">
            <div className="form-container">
              <div className="form-header">
                <h2>Edit Profile</h2>
                <p>Update your personal and professional information</p>
              </div>

              <form onSubmit={handleSubmit} className="profile-form">
                {/* Role Badge */}
                <div className="role-badge-container">
                  <div className={`role-badge ${user.role}`}>
                    {isCandidate ? <FaUser /> : <FaBuilding />}
                    <span>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                  </div>
                </div>

                {/* Name Field */}
                <div className="form-group">
                  <label htmlFor="name">
                    <FaUser />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    disabled={saving}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <label htmlFor="email">
                    <FaEnvelope />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    disabled={saving}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                {/* Bio Field */}
                <div className="form-group">
                  <label htmlFor="bio">
                    <FaEdit />
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    rows="4"
                    disabled={saving}
                  />
                </div>

                {/* Candidate Specific Fields */}
                {isCandidate && (
                  <>
                    <div className="form-group">
                      <label htmlFor="skills">
                        <FaBriefcase />
                        Skills
                      </label>
                      <input
                        type="text"
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="JavaScript, React, Node.js"
                        disabled={saving}
                      />
                      <p className="help-text">Separate skills with commas</p>
                    </div>

                    <div className="form-group">
                      <label htmlFor="resume">
                        <FaLink />
                        Resume Link
                      </label>
                      <input
                        type="url"
                        id="resume"
                        name="resume"
                        value={formData.resume}
                        onChange={handleChange}
                        placeholder="https://your-resume-link.com"
                        disabled={saving}
                        className={errors.resume ? 'error' : ''}
                      />
                      {errors.resume && <span className="error-message">{errors.resume}</span>}
                      <p className="help-text">Paste a link to your resume (Google Drive, Dropbox, etc.)</p>
                    </div>
                  </>
                )}

                {/* Employer Specific Fields */}
                {isEmployer && (
                  <>
                    <div className="form-group">
                      <label htmlFor="companyName">
                        <FaBuilding />
                        Company Name *
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Your Company Inc."
                        disabled={saving}
                        className={errors.companyName ? 'error' : ''}
                      />
                      {errors.companyName && <span className="error-message">{errors.companyName}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="companyWebsite">
                        <FaGlobe />
                        Company Website
                      </label>
                      <input
                        type="url"
                        id="companyWebsite"
                        name="companyWebsite"
                        value={formData.companyWebsite}
                        onChange={handleChange}
                        placeholder="https://yourcompany.com"
                        disabled={saving}
                        className={errors.companyWebsite ? 'error' : ''}
                      />
                      {errors.companyWebsite && <span className="error-message">{errors.companyWebsite}</span>}
                    </div>
                  </>
                )}

                {/* Form Actions */}
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleReset}
                    disabled={saving}
                  >
                    <FaTimes />
                    Reset
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="loading">
                        Saving...
                      </span>
                    ) : (
                      <>
                        <FaSave />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="auth-footer">
                <Link to="/dashboard" className="back-link">
                  ← Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Profile;