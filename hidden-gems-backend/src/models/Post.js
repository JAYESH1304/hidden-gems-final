const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  review: { type: String, required: true },
  type: { type: String, enum: ["music", "movie"], required: true },
  genre: { type: String },
  country: { type: String },
  language: { type: String },
  year: { type: Number },
  rating: { type: Number, min: 1, max: 5, required: true },
  externalLink: { type: String },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  moderationStatus: { type: String, default: "pending" },
});

module.exports = mongoose.model("Post", postSchema);
