require("dotenv").config();
const express = require("express");
const app = express();
const draftRouter = require("./routes/article.route");
const publishRouter = require("./routes/publish.route");
const categoryRouter = require("./routes/category.route");
const cors = require("cors");

const corsOptions = {
  origin: [process.env.FRONTEND_LOCALHOST, process.env.EDITOR_HEROKU_URL],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/articles", draftRouter);
app.use("/publish", publishRouter);
app.use("/categories", categoryRouter);

app.get("/", (req, res) => {
  res.send({
    0: "GET /",
    1: "POST /articles"
  });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  console.log(err);
  if (err.statusCode) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "Internal server error." });
  }
});

module.exports = app;
