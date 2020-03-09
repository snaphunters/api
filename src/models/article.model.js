const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
  content: { type: String, required: true }
});

const topicSubtopicSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  type: String,
  blocks: [blockSchema]
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

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
