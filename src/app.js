require("dotenv").config();
const express = require("express");
const app = express();
const articleRouter = require("./routes/article.route");
const cors = require("cors");

const corsOption = {
  origin: process.env.EDITOR_HEROKU
};

app.use(express.json());

app.use(cors(corsOption));

app.use("/articles", articleRouter);

app.get("/", (req, res) => {
  res.send({
    0: "GET /",
    1: "POST /articles"
  });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  if (err.statusCode) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "Internal server error." });
  }
});

module.exports = app;
