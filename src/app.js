require("dotenv").config();
const express = require("express");
const app = express();
const articleRouter = require("./routes/article.route");
<<<<<<< HEAD
const cors = require("cors");

const corsOption = {
  origin: process.env.EDITOR_HEROKU
};

app.use(express.json());

app.use(cors(corsOption));

=======

app.use(express.json());

>>>>>>> b9436bc1fe6d14e2fd2bf7245c8f24516b81bdc5
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
