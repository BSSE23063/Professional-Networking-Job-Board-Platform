const Job = require("../models/Job");
const Company = require("../models/Company");

// @desc    Get all jobs (with Search & Filter)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    // 1. Destructure query parameters
    const { keyword, location, type, company } = req.query;

    // 2. Build the filter object
    const filter = {};

    // Search by Keyword (Matches Title OR Description)
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } }, // 'i' makes it case-insensitive
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // Filter by Location
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // Filter by Job Type (e.g., "Full-time", "Remote")
    if (type) {
      filter.type = type;
    }

    // Filter by specific Company ID
    if (company) {
      filter.company = company;
    }

    // 3. Run Query with Filter
    const jobs = await Job.find(filter)
      .populate("company", "name logo location")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 }); // Show newest jobs first

    res.status(200).json(jobs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Employer only)
// controllers/jobController.js
const createJob = async (req, res) => {
  try {
    const { title, description, salary, location, type, companyName } =
      req.body;

    // 1. Check if user is an Employer
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can post jobs" });
    }

    // 2. Validate required fields
    if (!title || !description || !salary || !location || !companyName) {
      return res.status(400).json({
        message:
          "Please fill all required fields: title, description, salary, location, and company name",
      });
    }

    // 3. Validate job type
    const validTypes = ["Full-time", "Part-time", "Contract", "Remote"];
    if (type && !validTypes.includes(type)) {
      return res.status(400).json({
        message: `Invalid job type. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    // 4. Create the Job with companyName
    const job = await Job.create({
      title,
      description,
      salary,
      location,
      type: type || "Full-time",
      companyName, // Store company name as string
      createdBy: req.user.id,
      // company field is optional, so we don't need to provide it
    });

    // 5. Populate the createdBy field
    const populatedJob = await Job.findById(job._id).populate(
      "createdBy",
      "name email",
    );

    res.status(201).json(populatedJob);
  } catch (error) {
    console.error("Job creation error:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate job entry" });
    }

    res.status(500).json({ message: "Server Error" });
  }
};
// Add this function to your jobController.js

// @desc    Get job count (for dashboard stats)
// @route   GET /api/jobs/count
// @access  Public
const getJobCount = async (req, res) => {
  try {
    const { days } = req.query;

    let filter = {};

    // If days parameter is provided, filter jobs from last N days
    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));
      filter.createdAt = { $gte: daysAgo };
    }

    const count = await Job.countDocuments(filter);

    res.status(200).json({ count });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getjob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company", "name logo location")
      .populate("createdBy", "name");
    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Don't forget to update exports:
module.exports = {
  getJobs,
  createJob,
  getJobCount, // New
  getjob, // New
};
