const express = require("express");
const router = express.Router();
const { Publish } = require("../models/article.model");
const wrapAsync = require("../utils/wrapAsync");

router.post(
  "/",
  wrapAsync(async (req, res, next) => {
    await Publish.init();
    const newArticle = new Publish(req.body);
    await newArticle.save();

    res
      .status(201)
      .send({ ...newArticle.toObject(), category: req.body.category });
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
