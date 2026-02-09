import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import ErrorBoundary from '../Common/ErrorBoundary';
import { 
  FaUser, 
  FaBuilding, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaUserPlus,
  FaArrowRight,
  FaChevronRight
} from 'react-icons/fa';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate',
    companyName: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for role from query params
  const queryParams = new URLSearchParams(location.search);
  const roleFromQuery = queryParams.get('role');

  // Initialize role from query params if available
  useEffect(() => {
    if (roleFromQuery && (roleFromQuery === 'candidate' || roleFromQuery === 'employer')) {
      setFormData(prev => ({ ...prev, role: roleFromQuery }));
    }
  }, [roleFromQuery]);

  // Password strength checker
  useEffect(() => {
    const calculateStrength = (password) => {
      let strength = 0;
      
      if (password.length >= 8) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(password)) strength += 25;
      
      return strength;
    };

    setPasswordStrength(calculateStrength(formData.password));
  }, [formData.password]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const getStrengthColor = (strength) => {
    if (strength < 50) return '#ef4444';
    if (strength < 75) return '#f59e0b';
    return '#10b981';
  };

  const getStrengthText = (strength) => {
    if (strength < 50) return 'Weak';
    if (strength < 75) return 'Medium';
    return 'Strong';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (passwordStrength < 50) {
      newErrors.password = 'Please use a stronger password';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.role === 'employer' && !formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required for employers';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('❌ Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role
      };

      if (formData.role === 'employer') {
        userData.companyName = formData.companyName.trim();
      }

      // Call register API
      const result = await register(userData);
      
      if (result.success) {
        toast.success('🎉 Account created successfully!');
        
        // Navigate based on role
        if (formData.role === 'candidate') {
          navigate('/candidate/dashboard');
        } else {
          navigate('/employer/dashboard');
        }
      } else {
        toast.error(`❌ ${result.message || 'Registration failed'}`);
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ 
            general: result.message || 'Registration failed' 
          });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('⚠️ Registration failed. Please try again.');
      setErrors({ 
        general: error.message || 'Network error. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password, confirmPassword: password }));
    toast.info('🔒 Strong password generated!');
  };

  return (
    <ErrorBoundary message="Unable to load registration form">
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
        </div>

        {/* Right side - Form */}
        <div className="auth-form-side">
          <div className="form-container">
            <div className="form-header">
              <h2>Create Your Account</h2>
              <p>Join thousands of professionals finding their dream jobs</p>
            </div>

            {errors.general && (
              <div className="alert alert-error">
                <FaTimes />
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
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
                  disabled={loading}
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
                  disabled={loading}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* Company Name (for employers) */}
              {formData.role === 'employer' && (
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
                    disabled={loading}
                    className={errors.companyName ? 'error' : ''}
                  />
                  {errors.companyName && <span className="error-message">{errors.companyName}</span>}
                </div>
              )}

              {/* Password Field */}
              <div className="form-group">
                <div className="password-header">
                  <label htmlFor="password">
                    <FaLock />
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="generate-password-btn"
                    disabled={loading}
                  >
                    Generate Strong Password
                  </button>
                </div>
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
                
                {/* Password Strength */}
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-meter">
                      <div 
                        className="strength-bar"
                        style={{ 
                          width: `${passwordStrength}%`,
                          backgroundColor: getStrengthColor(passwordStrength)
                        }}
                      ></div>
                    </div>
                    <div className="strength-info">
                      <span>Strength: </span>
                      <strong style={{ color: getStrengthColor(passwordStrength) }}>
                        {getStrengthText(passwordStrength)}
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <FaLock />
                  Confirm Password *
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={loading}
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              {/* Terms & Conditions */}
              <div className="form-group terms">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    disabled={loading}
                    className={errors.agreeToTerms ? 'error' : ''}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">
                    I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link> *
                  </span>
                </label>
                {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading">
                    Creating Account...
                  </span>
                ) : (
                  <>
                    <FaUserPlus />
                    <span>Create Account</span>
                    <FaArrowRight />
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="login-link">
                <p>Already have an account?</p>
                <Link to="/login" className="login-link-btn">
                  <span>Sign In</span>
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

export default Register;