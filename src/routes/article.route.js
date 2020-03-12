const express = require("express");
const router = express.Router();
const { Draft } = require("../models/article.model");
const wrapAsync = require("../utils/wrapAsync");
const { v4: uuidv4 } = require("uuid");

router.post(
  "/",
  wrapAsync(async (req, res, next) => {
    const newArticle = new Draft(req.body);
    await Draft.init();
    newArticle.id = uuidv4();
    await newArticle.save();
    res.status(201).send(newArticle);
  })
);

router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const articleCollection = await Draft.find();
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
