const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true, trim: true },
    categories: String,
    subCategories: [],
    blocks: [],
    published: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
