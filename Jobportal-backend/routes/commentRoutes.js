const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  addComment, 
  getPostComments, 
  updateComment, 
  deleteComment 
} = require('../controllers/commentController');

// Add a comment to a post (Protected)
router.post('/:postId', protect, addComment);

// Get comments for a post (Public)
router.get('/:postId', getPostComments);

// Update a comment (Protected + Author Check inside controller)
router.put('/:commentId', protect, updateComment);

// Delete a comment (Protected + Author Check inside controller)
router.delete('/:commentId', protect, deleteComment);

module.exports = router;