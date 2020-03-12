const mongoose = require("mongoose");

const topicSubtopicSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  type: String,
  blockArray: []
});

const articleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true, trim: true },
    topicAndSubtopicArray: [topicSubtopicSchema],
    isPublished: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Draft = mongoose.model("Draft", articleSchema);
const Publish = mongoose.model("Publish", articleSchema);

module.exports = { Draft, Publish };
