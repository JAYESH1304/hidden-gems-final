const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['music', 'movie'],
    required: true
  },
  genre: {
    type: String,
    required: true,
    default: ''
  },
  country: {
    type: String,
    required: false,
    default: ''
  },
  language: {
    type: String,
    required: true,
    default: ''
  },
  year: {
    type: String,
    required: true,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: false,
    default: ''
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
