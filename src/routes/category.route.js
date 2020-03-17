const express = require("express");
const router = express.Router();

const Category = require("../models/category.model");
const wrapAsync = require("../utils/wrapAsync");

router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const projections = "name -_id";
    const categoriesArray = await Category.find({}, projections);
    const categoriesList = categoriesArray.map(
      categoryObject => categoryObject.name
    );
    res.status(200).send(categoriesList);
  })
);

module.exports = router;
