import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import ErrorBoundary from '../Common/ErrorBoundary';
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaUser, 
  FaBuilding,
  FaSignInAlt,
  FaArrowRight,
  FaChevronRight,
  FaTimes
} from 'react-icons/fa';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'candidate'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name] && formSubmitted) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role
      };

      const result = await login(userData.email, userData.password, userData.role);
      
      if (result.success) {
        toast.success('🎉 Welcome back! Login successful!');
        
        // Navigate based on role
        if (formData.role === 'candidate') {
          navigate('/candidate/dashboard');
        } else {
          navigate('/employer/dashboard');
        }
      } else {
        toast.error(`❌ ${result.message || 'Login failed'}`);
        setErrors({ 
          general: result.message || 'Login failed' 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('⚠️ Network error. Please check your connection and try again.');
      setErrors({ 
        general: error.message || 'Network error. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info('📧 Password reset feature coming soon!');
  };

  return (
    <ErrorBoundary message="Unable to load login form">
      <div className="auth-container">
        {/* Left side - Info */}
        <div className="auth-info-side">
          <div className="auth-logo">
            <h1>JobPortal</h1>
            <p className="tagline">Your career journey starts here</p>
          </div>
          
          <div className="auth-features">
            <div className="feature">
              <FaUser className="feature-icon" />
              <div>
                <h3>Personalized Experience</h3>
                <p>Tailored job recommendations based on your profile</p>
              </div>
            </div>
            
            <div className="feature">
              <FaBuilding className="feature-icon" />
              <div>
                <h3>Top Companies</h3>
                <p>Connect with leading employers worldwide</p>
              </div>
            </div>
            
            <div className="feature">
              <FaSignInAlt className="feature-icon" />
              <div>
                <h3>Secure Access</h3>
                <p>Your data is protected with enterprise-grade security</p>
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
        </div>

        {/* Right side - Form */}
        <div className="auth-form-side">
          <div className="form-container">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to continue your journey</p>
            </div>

            {errors.general && (
              <div className="alert alert-error">
                <FaTimes />
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {/* Role Selection */}
              <div className="role-selection">
                <p className="section-label">I want to sign in as:</p>
                <div className="role-options">
                  <button
                    type="button"
                    className={`role-option ${formData.role === 'candidate' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, role: 'candidate' }))}
                  >
                    <FaUser />
                    <span>Candidate</span>
                  </button>
                  <button
                    type="button"
                    className={`role-option ${formData.role === 'employer' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, role: 'employer' }))}
                  >
                    <FaBuilding />
                    <span>Employer</span>
                  </button>
                </div>
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
                  disabled={loading}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">
                  <FaLock />
                  Password *
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={loading}
                    className={errors.password ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
                <div className="password-hint">
                  Must be at least 6 characters long
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">Remember me</span>
                </label>
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="forgot-password"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading">
                    Signing In...
                  </span>
                ) : (
                  <>
                    <FaSignInAlt />
                    <span>Sign In</span>
                    <FaArrowRight />
                  </>
                )}
              </button>

              {/* Register Link */}
              <div className="register-link">
                <p>Don't have an account?</p>
                <Link to="/register" className="register-link-btn">
                  <span>Create New Account</span>
                  <FaChevronRight />
                </Link>
              </div>
            </form>

            <div className="auth-footer">
              <Link to="/" className="back-link">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Login;