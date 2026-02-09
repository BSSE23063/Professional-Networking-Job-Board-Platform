const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Add a comment to a post
// @route   POST /api/comments/:postId
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.postId;

    // 1. Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // 2. Create the comment
    const comment = await Comment.create({
      text,
      post: postId,
      author: req.user.id
    });

    res.status(201).json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all comments for a post
// @route   GET /api/comments/:postId
// @access  Public
const getPostComments = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find comments for this post and show author details
    const comments = await Comment.find({ post: postId })
      .populate('author', 'name profilePic')
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:commentId
// @access  Private (Author only)
const updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const commentId = req.params.commentId;

    // 1. Find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // 2. Check if the logged-in user is the author
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    // 3. Update the comment
    comment.text = text || comment.text;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private (Author only)
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    // 1. Find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // 2. Check if the logged-in user is the author
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // 3. Delete the comment
    await comment.deleteOne();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  addComment,
  getPostComments,
  updateComment,
  deleteComment
};