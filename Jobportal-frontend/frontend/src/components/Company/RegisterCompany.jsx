import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { companyService } from '../../services/companyService';
import { toast } from 'react-toastify';
import './Company.css';

const RegisterCompany = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    logo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (user.role !== 'employer') {
      toast.error('Only employers can register companies');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Company name is required');
      return;
    }

    try {
      setLoading(true);
      await companyService.registerCompany(formData);
      toast.success('Company registered successfully!');
      navigate('/companies');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-company">
      <div className="form-container">
        <h1>Register Your Company</h1>
        <p className="form-subtitle">
          Add your company to start posting jobs and attracting talent
        </p>

        <form onSubmit={handleSubmit} className="company-form">
          <div className="form-group">
            <label htmlFor="name">Company Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Company Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="4"
              placeholder="Describe your company, mission, and values..."
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="form-control"
                placeholder="https://example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-control"
                placeholder="City, Country"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="logo">Logo URL</label>
            <input
              type="url"
              id="logo"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              className="form-control"
              placeholder="https://example.com/logo.png"
            />
            <small className="help-text">
              Provide a direct link to your company logo image
            </small>
          </div>

          {formData.logo && (
            <div className="logo-preview">
              <h4>Logo Preview:</h4>
              <img src={formData.logo} alt="Logo preview" onError={(e) => {
                e.target.style.display = 'none';
              }} />
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCompany;