const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const contentModeration = require('../middleware/contentModeration');
const Post = require('../models/Post');

const router = express.Router();

// Get all posts (GET /api/posts)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('authorId', 'username').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get single post by ID (GET /api/posts/:id)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('authorId', 'username');
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Create post (POST /api/posts)
router.post(
  '/',
  authMiddleware,
  contentModeration,
  async (req, res) => {
    try {
      const { title, description, review, type, genre, country, language, year, rating, externalLink } = req.body;
      const post = new Post({
        title,
        description,
        review,
        type,
        genre,
        country,
        language,
        year,
        rating,
        externalLink,
        authorId: req.user.id,
        moderationStatus: "approved",
      });
      await post.save();
      res.status(201).json({ msg: "Post created successfully", post });
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  }
);

// Update/Edit post (PUT /api/posts/:id)
router.put('/:id', authMiddleware, contentModeration, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Only author can edit
    if (post.authorId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to edit this post' });
    }

    const { title, description, review, type, genre, country, language, year, rating, externalLink } = req.body;
    
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, description, review, type, genre, country, language, year, rating, externalLink },
      { new: true }
    );

    res.json({ msg: 'Post updated successfully', post: updatedPost });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get logged-in user's posts (GET /api/posts/user/me)
router.get('/user/me', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});



// Delete post (DELETE /api/posts/:id)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Only author or admin can delete
    if (post.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
