const Post = require('../models/Post');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;

    const post = await Post.create({
      content,
      image,
      author: req.user.id
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all posts (Community Feed)
// @route   GET /api/posts
// @access  Public (or Private, your choice)
const getAllPosts = async (req, res) => {
  try {
    // Get posts, sort by newest first (-1), and populate author details
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name profilePic role');

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Like or Unlike a post
// @route   PUT /api/posts/like/:id
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if post has already been liked by this user
    if (post.likes.includes(req.user.id)) {
        // If liked, remove the like (Unlike)
        post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    } else {
        // If not liked, add the like
        post.likes.push(req.user.id);
    }

    await post.save();
    res.status(200).json(post.likes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profilePic role')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name profilePic role'
        }
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  likePost,
  getPostById
};