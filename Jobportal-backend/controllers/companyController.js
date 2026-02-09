const Company = require('../models/Company');

// @desc    Register a new company
// @route   POST /api/companies
// @access  Private (Employer only)
const registerCompany = async (req, res) => {
  try {
    const { name, description, website, location, logo } = req.body;

    // 1. Check if user is an Employer
    if (req.user.role !== 'employer') {
        return res.status(403).json({ message: 'Only employers can register companies' });
    }

    // 2. Check if company name already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    // 3. Create Company
    const company = await Company.create({
      name,
      description,
      website,
      location,
      logo,
      userId: req.user.id
    });

    res.status(201).json(company);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('userId', 'name');
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('userId', 'name');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  registerCompany,
  getCompanies,
  getCompanyById
};