const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  applyForJob, 
  getJobApplicants,
  getCandidateApplications,
  getEmployerApplicants,
  updateApplicationStatus
} = require('../controllers/applicationController');

// Apply for a job (Candidate)
router.post('/:jobId', protect, applyForJob);

// View applicants for a job (Employer)
router.get('/job/:jobId', protect, getJobApplicants);

// Get all applications for candidate
router.get('/', protect, getCandidateApplications);

// Get all applicants for employer's jobs
router.get('/employer/applicants', protect, getEmployerApplicants);

// Update application status
router.put('/:id/status', protect, updateApplicationStatus);

module.exports = router;