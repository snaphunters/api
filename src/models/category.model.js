const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    default: "Uncategorized"
  },
  topicIdArray: [
    {
      type: String,
      minlength: 32
    }
  ]
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
