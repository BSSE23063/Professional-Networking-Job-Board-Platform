const express = require('express');
const router = express.Router();
const { getJobs, createJob, getJobCount, getjob } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

// Route for getting all jobs (Public)
router.get('/', getJobs);

// Route for job count (Public)
router.get('/count', getJobCount);

// Route for creating a job (Protected + Employer Only)
router.post('/', protect, createJob);

// Route for getting a specific job (Public)
router.get('/:id', getjob);

module.exports = router;