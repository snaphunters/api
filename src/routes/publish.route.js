const express = require("express");
const router = express.Router();
const { Publish } = require("../models/article.model");
const Category = require("../models/category.model");
const wrapAsync = require("../utils/wrapAsync");

router.post(
  "/",
  wrapAsync(async (req, res, next) => {
    await Publish.init();
    const newArticle = new Publish(req.body);
    await newArticle.save();

    const categoryName = req.body.category;
    await Category.init();
    const categoryPresent = await Category.find({
      name: categoryName
    });
    if (categoryPresent.length === 0) {
      const newCategory = new Category({
        name: categoryName,
        topicIdArray: [req.body.id]
      });
      await newCategory.save();
    } else {
      await Category.findOneAndUpdate(
        { name: categoryName },
        { $push: { topicIdArray: req.body.id } },
        { runValidators: true }
      );
    }
    res.status(201).send({ ...newArticle.toObject(), category: categoryName });
  })
);

router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const articleCollection = await Publish.find();
    res.status(200).send(articleCollection);
  })
);

router.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  if (err.name === "MongoError") {
    err.statusCode = 422;
    err.message = "Duplicate Title Error.";
  }
  next(err);
});

module.exports = router;
