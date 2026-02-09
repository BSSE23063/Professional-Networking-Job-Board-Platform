const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, companyName, profilePic } = req.body;

    // 1. Basic Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // 2. ROLE-SPECIFIC VALIDATION (New Logic) 
    // If user tries to register as an Employer, they MUST have a company name
    // if (role === 'employer' && !companyName) {
    //   return res.status(400).json({ message: 'Employers must provide a Company Name' });
    // }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'candidate', // Default to candidate
      profilePic: profilePic || '',
      companyName: role === 'employer' ? companyName : '', // Only save company name if employer
      createdAt: Date.now()
      
    });

    if (user) {
      res.status(201).json({
        // _id: user.id,
        // name: user.name,
        // email: user.email,
        // role: user.role,
        // profilePic: user.profilePic,
        // companyName: user.companyName,
        token: generateToken(user._id),
        user
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Authenticate a user (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    // Note: We accept 'role' here too, so we can check which portal they are using
    const { email, password, role } = req.body; 

    // Check for user email
    const user = await User.findOne({ email });

    // Check password
    if (user && (await bcrypt.compare(password, user.password))) {
      
      // 3. ROLE VERIFICATION (New Logic)
      // If the frontend sent a role (e.g. they are on the "Employer Login" page),
      // we check if it matches their actual database role.
      if (role && user.role !== role) {
        return res.status(401).json({ 
          message: `Access denied. You are registered as a ${user.role}, but trying to login as a ${role}.` 
        });
      }

      res.json({
        
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id) // <--- The Script looks for THIS
    
      });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};


const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      // If password is sent, update it (hashing handled by pre-save middleware)
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      // Update other fields if they exist in your schema (e.g. bio, skills)
      // If you haven't added these to UserSchema yet, you can just stick to name/email
      
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: req.token // You might not need to send a new token, but it's okay
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add this function to your authController.js

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate profile completion percentage
    let completionScore = 0;
    let totalFields = 0;
    
    // Basic info (20%)
    if (user.name) completionScore += 10;
    if (user.email) completionScore += 10;
    totalFields += 2;
    
    // Role-specific fields
    if (user.role === 'candidate') {
      if (user.profilePic) completionScore += 10;
      if (user.resume) completionScore += 30;
      if (user.skills && user.skills.length > 0) completionScore += 20;
      if (user.bio) completionScore += 10;
      totalFields += 4;
    } else if (user.role === 'employer') {
      if (user.profilePic) completionScore += 10;
      if (user.companyName) completionScore += 30;
      if (user.companyWebsite) completionScore += 20;
      if (user.bio) completionScore += 10;
      totalFields += 4;
    }
    
    const profileCompletion = Math.round((completionScore / (totalFields * 10)) * 100);

    res.status(200).json({
      user,
      profileCompletion,
      nextSteps: user.role === 'candidate' 
        ? ['Upload resume', 'Add skills', 'Complete bio']
        : ['Complete company profile', 'Add company website', 'Write bio']
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Don't forget to add to exports:
module.exports = {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile  // New
};