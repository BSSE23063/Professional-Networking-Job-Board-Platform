// pages/PostJob.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/jobService';
import { toast } from 'react-toastify';
import { 
  FaBriefcase, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaDollarSign, 
  FaGlobe,
  FaCalendar,
  FaFileAlt,
  FaArrowLeft,
  FaSpinner
} from 'react-icons/fa';
import './PostJob.css';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [jobData, setJobData] = useState({
    title: '',
    companyName: '', // This will be sent as companyName
    location: '',
    salary: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    experience: '',
    education: '',
    benefits: '',
    applicationDeadline: '',
    contactEmail: user?.email || ''
    // Removed workType as it's not in your schema
  });

  const jobTypes = [
    { value: 'Full-time', label: 'Full Time' },
    { value: 'Part-time', label: 'Part Time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Remote', label: 'Remote' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Submitting job data:', jobData);
    
    // Validation
    if (!jobData.title.trim() || !jobData.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    if (!jobData.companyName.trim()) {
      toast.error('Company name is required');
      return;
    }

    if (!jobData.salary) {
      toast.error('Salary is required');
      return;
    }

    if (!jobData.location) {
      toast.error('Location is required');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare job payload - match exactly what backend expects
      const jobPayload = {
        title: jobData.title,
        description: jobData.description,
        salary: jobData.salary,
        location: jobData.location,
        type: jobData.type,
        companyName: jobData.companyName,
        createdBy: user.id,
        // Optional fields - only include if they have values
        ...(jobData.requirements && { requirements: jobData.requirements }),
        ...(jobData.experience && { experience: jobData.experience }),
        ...(jobData.education && { education: jobData.education }),
        ...(jobData.benefits && { benefits: jobData.benefits }),
        ...(jobData.applicationDeadline && { applicationDeadline: jobData.applicationDeadline }),
        ...(jobData.contactEmail && { contactEmail: jobData.contactEmail })
      };

      console.log('Sending job payload:', jobPayload);
      
      const response = await jobService.createJob(jobPayload);
      console.log('Job created successfully:', response);
      
      toast.success('Job posted successfully!');
      navigate('/jobs');
    } catch (err) {
      console.error('Error posting job:', err);
      console.error('Error details:', err.response?.data);
      
      let errorMessage = 'Failed to post job. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const errors = err.response.data.errors;
        errorMessage = Object.values(errors).map(err => err.message).join(', ');
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="post-job-page">
      <div className="container">
        <div className="post-job-header">
          <button onClick={handleCancel} className="back-btn">
            <FaArrowLeft />
            <span>Back</span>
          </button>
          <h1>Post a New Job</h1>
          <p>Fill in the details below to post your job opening</p>
        </div>

        <form onSubmit={handleSubmit} className="post-job-form">
          <div className="form-grid">
            {/* Job Title */}
            <div className="form-group">
              <label htmlFor="title">
                <FaBriefcase className="input-icon" />
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                placeholder="e.g., Senior React Developer"
                required
                className="form-control"
              />
            </div>

            {/* Company Name */}
            <div className="form-group">
              <label htmlFor="companyName">
                <FaBuilding className="input-icon" />
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={jobData.companyName}
                onChange={handleChange}
                placeholder="e.g., Tech Corp Inc."
                required
                className="form-control"
              />
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location">
                <FaMapMarkerAlt className="input-icon" />
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                placeholder="e.g., New York, NY or Remote"
                required
                className="form-control"
              />
            </div>

            {/* Salary */}
            <div className="form-group">
              <label htmlFor="salary">
                <FaDollarSign className="input-icon" />
                Salary Range *
              </label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={jobData.salary}
                onChange={handleChange}
                placeholder="e.g., $80,000 - $120,000"
                required
                className="form-control"
              />
            </div>

            {/* Job Type */}
            <div className="form-group">
              <label htmlFor="type">
                <FaBriefcase className="input-icon" />
                Job Type *
              </label>
              <select
                id="type"
                name="type"
                value={jobData.type}
                onChange={handleChange}
                required
                className="form-control"
              >
                {jobTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div className="form-group">
              <label htmlFor="experience">
                <FaBriefcase className="input-icon" />
                Experience Required
              </label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={jobData.experience}
                onChange={handleChange}
                placeholder="e.g., 3-5 years"
                className="form-control"
              />
            </div>

            {/* Application Deadline */}
            <div className="form-group">
              <label htmlFor="applicationDeadline">
                <FaCalendar className="input-icon" />
                Application Deadline
              </label>
              <input
                type="date"
                id="applicationDeadline"
                name="applicationDeadline"
                value={jobData.applicationDeadline}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="form-group">
            <label htmlFor="description">
              <FaFileAlt className="input-icon" />
              Job Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={jobData.description}
              onChange={handleChange}
              placeholder="Describe the job responsibilities, what you're looking for..."
              rows="6"
              required
              className="form-control"
            />
          </div>

          {/* Requirements */}
          <div className="form-group">
            <label htmlFor="requirements">
              <FaFileAlt className="input-icon" />
              Requirements & Skills
            </label>
            <textarea
              id="requirements"
              name="requirements"
              value={jobData.requirements}
              onChange={handleChange}
              placeholder="List required skills, technologies, certifications..."
              rows="4"
              className="form-control"
            />
          </div>

          {/* Benefits */}
          <div className="form-group">
            <label htmlFor="benefits">
              <FaFileAlt className="input-icon" />
              Benefits & Perks
            </label>
            <textarea
              id="benefits"
              name="benefits"
              value={jobData.benefits}
              onChange={handleChange}
              placeholder="List benefits like health insurance, remote work, etc."
              rows="3"
              className="form-control"
            />
          </div>

          {/* Contact Email */}
          <div className="form-group">
            <label htmlFor="contactEmail">
              Contact Email for Applications *
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={jobData.contactEmail}
              onChange={handleChange}
              required
              className="form-control"
            />
            <small className="help-text">
              This email will receive job applications
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  Posting Job...
                </>
              ) : (
                'Post Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;