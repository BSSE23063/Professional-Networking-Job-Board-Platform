import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUser, 
  FaBriefcase, 
  FaBuilding, 
  FaUsers, 
  FaSignOutAlt, 
  FaBell, 
  FaSearch,
  FaEnvelope,
  FaRocket,
  FaCaretDown,
  FaPlus,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <Link to="/" className="logo-link">
              <div className="logo-icon">
                <FaRocket />
              </div>
              <div className="logo-text">
                <span className="logo-primary">Job</span>
                <span className="logo-secondary">Portal</span>
              </div>
            </Link>
          </div>

          {/* Search Bar - Only show when user is logged in */}
          {/* {user && (
            <div className="search-container">
              <div className="search-wrapper">
                <FaSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search jobs, companies, or keywords..." 
                  className="search-input"
                />
                <button className="search-button">
                  <FaSearch />
                </button>
              </div>
            </div>
          )} */}

          {/* Desktop Navigation */}
          <nav className={`nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            {/* Close button for mobile */}
            <button className="mobile-menu-close" onClick={toggleMobileMenu}>
              <FaTimes />
            </button>

            {/* Navigation Links - Only show when user is logged in */}
            {user ? (
              <>
                <div className="nav-links">
                  <Link to="/jobs" className="nav-link">
                    <FaBriefcase />
                    <span>Jobs</span>
                  </Link>
                  <Link to="/companies" className="nav-link">
                    <FaBuilding />
                    <span>Companies</span>
                  </Link>
                  <Link to="/community" className="nav-link">
                    <FaUsers />
                    <span>Community</span>
                  </Link>
                </div>

                <div className="user-actions">
                  {/* Post Job Button - Show based on user role */}
                  {user.role === 'employer' && (
                    <Link to="/post-job" className="btn-post-job">
                      <FaPlus />
                      <span>Post a Job</span>
                    </Link>
                  )}

                  {/* Notifications */}
                  <button className="btn-notification">
                    <FaBell />
                    {hasNotifications && <span className="notification-dot"></span>}
                  </button>

                  {/* User Profile Dropdown */}
                  <div className="profile-dropdown">
                    <button 
                      className="profile-toggle" 
                      onClick={toggleProfileDropdown}
                    >
                      <div className="profile-avatar">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="profile-info">
                        <span className="profile-name">{user.name || 'User'}</span>
                        <span className="profile-role">{user.role || 'Member'}</span>
                      </div>
                      <FaCaretDown className={`dropdown-arrow ${isProfileDropdownOpen ? 'rotated' : ''}`} />
                    </button>

                    {isProfileDropdownOpen && (
                      <div className="dropdown-menu">
                        <div className="dropdown-header">
                          <div className="dropdown-avatar">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="dropdown-name">{user.name || 'User'}</div>
                            <div className="dropdown-email">{user.email || 'user@example.com'}</div>
                          </div>
                        </div>
                        
                        <div className="dropdown-divider"></div>
                        
                        <Link to="/dashboard" className="dropdown-item">
                          <FaBriefcase />
                          <span>Dashboard</span>
                        </Link>
                        <Link to="/profile" className="dropdown-item">
                          <FaUser />
                          <span>My Profile</span>
                        </Link>
                        <Link to="/applications" className="dropdown-item">
                          <FaUsers />
                          <span>My Applications</span>
                        </Link>
                        
                        <div className="dropdown-divider"></div>
                        
                        <Link to="/settings" className="dropdown-item">
                          <span>Account Settings</span>
                        </Link>
                        <Link to="/help" className="dropdown-item">
                          <span>Help Center</span>
                        </Link>
                        
                        <div className="dropdown-divider"></div>
                        
                        <button onClick={handleLogout} className="dropdown-item logout">
                          <FaSignOutAlt />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="auth-actions">
                <Link to="/login" className="btn btn-login">
                  <FaUser />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="btn btn-primary">
                  <span>Register</span>
                  <FaRocket className="rocket-icon" />
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;