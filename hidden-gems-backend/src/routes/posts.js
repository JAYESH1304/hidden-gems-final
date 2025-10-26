const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Get all posts (public)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single post (public)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, type, genre, country, language, year, description, review, rating } = req.body;

    // Validate required fields
    if (!title || !type || !description) {
      return res.status(400).json({ message: 'Please provide title, type, and description' });
    }

    const post = new Post({
      title,
      type,
      genre: genre || '',
      country: country || '',
      language: language || '',
      year: year || '',
      description,
      review: review || '',
      rating: rating || 0,
      user: req.userId
    });

    await post.save();
    await post.populate('user', 'username');
    
    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update post route
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to edit this post' });
    }

    const { title, type, genre, country, language, year, description, review, rating } = req.body;

    // Update fields
    post.title = title || post.title;
    post.type = type || post.type;
    post.genre = genre !== undefined ? genre : post.genre;
    post.country = country !== undefined ? country : post.country;
    post.language = language !== undefined ? language : post.language;
    post.year = year !== undefined ? year : post.year;
    post.description = description || post.description;
    post.review = review !== undefined ? review : post.review;
    post.rating = rating !== undefined ? rating : post.rating;

    await post.save();
    await post.populate('user', 'username');
    
    res.json(post);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Delete post (protected - only post owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's own posts (protected)
router.get('/user/me', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
