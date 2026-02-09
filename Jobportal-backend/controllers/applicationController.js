const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate only)
const applyForJob = async (req, res) => {
  try {
    // 1. Get data from body (Now including resumeLink)
    const { coverLetter, resumeLink } = req.body;
    const jobId = req.params.jobId;

    // if (req.user.role !== 'candidate') {
    //   return res.status(403).json({ message: 'Only candidates can apply' });
    // }

    if (!resumeLink) {
        return res.status(400).json({ message: 'Resume link is required' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      coverLetter,
      resumeLink // <--- Saving the link
    });

    res.status(201).json(application);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ... keep getJobApplicants the same as before ...
const getJobApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email profilePic'); 

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add these new functions to your applicationController.js

// @desc    Get all applications for the logged-in candidate
// @route   GET /api/applications
// @access  Private (Candidate only)
const getCandidateApplications = async (req, res) => {
  try {
    // if (req.user.role !== 'candidate') {
    //   return res.status(403).json({ message: 'Only candidates can view applications' });
    // }

    const applications = await Application.find({ applicant: req.user.id })
      .populate('job', 'title description salary location type')
      .populate('job.company', 'name logo')
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all applicants for employer's jobs
// @route   GET /api/applications/employer/applicants
// @access  Private (Employer only)
const getEmployerApplicants = async (req, res) => {
  try {
    // if (req.user.role !== 'employer') {
    //   return res.status(403).json({ message: 'Only employers can view applicants' });
    // }

    // Find all jobs created by this employer
    const jobs = await Job.find({ createdBy: req.user.id });
    const jobIds = jobs.map(job => job._id);

    // Find applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title')
      .populate('applicant', 'name email profilePic skills')
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer only - owner of the job)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId)
      .populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if the logged-in user is the job creator
    if (application.job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    // Validate status
    const validStatuses = ['applied', 'shortlisted', 'interview', 'hired', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    application.status = status;
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Don't forget to export all functions at the end:
module.exports = {
  applyForJob,
  getJobApplicants,
  getCandidateApplications,    // New
  getEmployerApplicants,      // New
  updateApplicationStatus     // New
};

