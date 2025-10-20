const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');
const contentModeration = require('../middleware/contentModeration');

const router = express.Router();

// Post a comment on a post (POST /api/comments/:postId)
router.post('/:postId', authMiddleware, contentModeration, async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    // Check that the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const comment = new Comment({
      postId,
      authorId: req.user.id,
      content,
    });

    await comment.save();
    res.status(201).json({ msg: "Comment saved", comment });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get all comments for a post (GET /api/comments/:postId)
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).populate('authorId', 'username');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// DELETE /api/comments/:commentId
router.delete('/:commentId', authMiddleware, async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) return res.status(404).json({ msg: 'Comment not found' });
  
      // Only author or admin can delete
      if (comment.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Not authorized to delete this comment' });
      }
      await Comment.findByIdAndDelete(req.params.commentId);
      res.json({ msg: 'Comment deleted' });
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });
  

module.exports = router;
