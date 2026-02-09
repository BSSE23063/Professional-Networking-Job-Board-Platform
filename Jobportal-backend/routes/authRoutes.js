const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  registerUser, 
  loginUser, 
  updateUserProfile,
  getUserProfile  // Import new function
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Update Profile (Protected)
router.put('/profile', protect, updateUserProfile);

// NEW ROUTE: Get User Profile (Protected)
router.get('/profile', protect, getUserProfile);

module.exports = router;