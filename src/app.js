const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    0: "GET /",
    1: "POST /articles"
  });
});

module.exports = app;
