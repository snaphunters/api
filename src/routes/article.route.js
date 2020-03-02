const express = require("express");
const router = express.Router();
const Article = require("../models/article.model");
const wrapAsync = require("../utils/wrapAsync");

router.post(
  "/",
  wrapAsync(async (req, res, next) => {
    const newArticle = new Article(req.body);
    await Article.init();
    await newArticle.save();
    res.status(201).send(newArticle);
  })
);

router.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  next(err);
});

module.exports = router;
