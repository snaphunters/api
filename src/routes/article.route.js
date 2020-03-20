const express = require("express");
const router = express.Router();
const { Draft } = require("../models/article.model");
const Category = require("../models/category.model");
const wrapAsync = require("../utils/wrapAsync");

router.post(
  "/",
  wrapAsync(async (req, res, next) => {
    await Draft.init();
    const newArticle = new Draft(req.body);
    await newArticle.save();

    let categoryName = req.body.category;
    if (categoryName === "" || categoryName === undefined) {
      categoryName = "Uncategorized";
    }
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

router.patch(
  "/update/:articleId",
  wrapAsync(async (req, res, next) => {
    const updatedContent = req.body;
    const article = await Draft.findOneAndUpdate(
      {
        id: req.params.articleId
      },
      updatedContent,
      { new: true, runValidators: true }
    );
    const allCategories = await Category.find();
    const oldCategory = allCategories.filter(categoryObject =>
      categoryObject.topicIdArray.includes(req.params.articleId)
    )[0];
    await Category.findOneAndUpdate(
      { name: req.body.category },
      { $push: { topicIdArray: req.params.articleId } },
      { runValidators: true }
    );

    await Category.findOneAndUpdate(
      { name: oldCategory.name },
      { $pull: { topicIdArray: req.params.articleId } },
      { runValidators: true }
    );

    res.status(200).send(article);
  })
);

router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const articleCollection = await Draft.find();
    res.status(200).send(articleCollection);
  })
);

router.get(
  "/:articleTitle",
  wrapAsync(async (req, res, next) => {
    const foundArticle = await Draft.find({ title: req.params.articleTitle });
    const articleId = foundArticle[0].id;
    const findAllCategories = await Category.find();
    const tempArray = findAllCategories.map(categoryObject =>
      categoryObject.topicIdArray.includes(articleId)
        ? categoryObject.name
        : "Uncategorized"
    );
    const category = tempArray[0];
    res.send({ ...foundArticle, category: category });
  })
);

router.delete(
  "/:articleTitle",
  wrapAsync(async (req, res, next) => {
    const articleToDelete = await Draft.findOneAndDelete({
      title: req.params.articleTitle
    });
    res.status(200).send(articleToDelete);
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
