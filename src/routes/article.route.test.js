const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { v4: uuidv4 } = require("uuid");

const Article = require("../models/article.model");
const app = require("../app");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("article.route.js", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();
      await mongoose.connect(mongoUri);
    } catch (error) {
      console.log(error);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {});

  afterEach(async () => {
    jest.resetAllMocks();
    await Article.deleteMany();
  });

  it("POST /articles should return message 201 created and the article posted", async () => {
    const mockArticle = {
      id: uuidv4(),
      title: "This is a test article"
    };
    const { body } = await request(app)
      .post("/articles")
      .send(mockArticle)
      .expect(201);
    expect(body).toMatchObject(mockArticle);
  });

  it("POST / should return message 400 as validation error when title is not given", async () => {
    const mockArticle = {
      id: uuidv4()
    };
    const { body: err } = await request(app)
      .post("/articles")
      .send(mockArticle)
      .expect(400);
    expect(err).toEqual({
      error: "Article validation failed: title: Path `title` is required."
    });
  });

  it("POST / should return 500 as internal server error when server is not responding", async () => {
    const mockArticle = {
      id: uuidv4(),
      title: "This is a test article"
    };
    const origFunction = Article.init;
    Article.init = jest.fn();
    Article.init.mockImplementationOnce(() => {
      throw new Error();
    });
    const { body: err } = await request(app)
      .post("/articles")
      .send(mockArticle)
      .expect(500);
    expect(err).toEqual({
      error: "Internal server error."
    });
    Article.init = origFunction;
  });
});
