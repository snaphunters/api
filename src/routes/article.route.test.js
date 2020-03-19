const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Category = require("../models/category.model");
const { Draft } = require("../models/article.model");
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

  beforeEach(async () => {
    const mockArticle = {
      isPublished: false,
      _id: "5e660cefd4d9040017bc061e",
      title: "asdefrrrrrr",
      topicAndSubtopicArray: [
        {
          blockArray: ["<p>sdjkadjaksdjaskjdkasdj</p>"],
          _id: "5e660cefd4d9040017bc061f",
          title: "asdefrrrrrr"
        },
        {
          blockArray: ["<p>;l'g;ldfkgl;dfkgl;dfkgl;dfkgl;dkg;</p>"],
          _id: "5e660cefd4d9040017bc0620",
          title: "mcncncncnc"
        }
      ],
      id: "411b3f25-f2b0-453e-8319-927590220ad0",
      createdAt: "2020-03-09T09:31:27.519Z",
      updatedAt: "2020-03-09T09:31:27.519Z",
      category: "lemonade",
      __v: 0
    };
    await Category.create({
      name: mockArticle.category,
      topicIdArray: ["411b3f25-f2b0-453e-8319-927590220ad0"]
    });
    await Draft.create(mockArticle);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await Draft.deleteMany();
    await Category.deleteMany();
  });

  it("POST /articles should return message 201 created and the article posted", async () => {
    const mockArticle = {
      title: "This is the test article",
      id: "411b3f25-f2b0-453e-8319-827590220ad0"
    };
    const { body } = await request(app)
      .post("/articles")
      .send(mockArticle)
      .expect(201);
    expect(body).toMatchObject(mockArticle);
  });

  it("POST /articles with categories that are already in the DB should return message 201 created and the article posted", async () => {
    const mockArticle = {
      title: "This is the test article",
      id: "411b3f25-f2b0-453e-8319-727590220ad0",
      category: "lemonade"
    };
    const { body } = await request(app)
      .post("/articles")
      .send(mockArticle)
      .expect(201);
    expect(body).toMatchObject(mockArticle);
  });

  it("POST / should return message 400 when as validation error when title is not given", async () => {
    const mockArticle = {};
    const { body: err } = await request(app)
      .post("/articles")
      .send(mockArticle)
      .expect(400);
    expect(err).toEqual({
      error:
        "Draft validation failed: title: Path `title` is required., id: Path `id` is required."
    });
  });

  it("POST / should return message 422 as validation error when title is a duplicate", async () => {
    const mockArticle = {
      isPublished: false,
      _id: "5e660cefd4d9040017bc061e",
      title: "asdefrrrrrr",
      topicAndSubtopicArray: [
        {
          blockArray: ["<p>sdjkadjaksdjaskjdkasdj</p>"],
          _id: "5e660cefd4d9040017bc061f",
          title: "asdefrrrrrr"
        },
        {
          blockArray: ["<p>;l'g;ldfkgl;dfkgl;dfkgl;dfkgl;dkg;</p>"],
          _id: "5e660cefd4d9040017bc0620",
          title: "mcncncncnc"
        }
      ],
      id: "411b3f25-f2b0-453e-8319-927590220ad0",
      createdAt: "2020-03-09T09:31:27.519Z",
      updatedAt: "2020-03-09T09:31:27.519Z",
      __v: 0
    };
    const { body: err } = await request(app)
      .post("/articles")
      .send(mockArticle)
      .expect(422);
    expect(err).toEqual({
      error: "Duplicate Title Error."
    });
  });

  it("POST / should return message 500 as internal server error when server is not responding", async () => {
    const mockArticle = {
      title: "This is a test article"
    };
    const origFunction = Draft.init;
    Draft.init = jest.fn();
    Draft.init.mockImplementationOnce(() => {
      throw new Error();
    });
    const { body: err } = await request(app)
      .post("/articles")
      .send(mockArticle)
      .expect(500);
    expect(err).toEqual({
      error: "Internal server error."
    });
    Draft.init = origFunction;
  });
  it("GET /articles should return message 200 ok and all the articles posted", async () => {
    const mockArticles = [
      {
        title: "This is article one"
      },
      {
        title: "This is article two"
      }
    ];
    const origFunction = Draft.find;
    Draft.find = jest.fn();
    Draft.find.mockImplementationOnce(() => {
      return mockArticles;
    });
    const { body: articleCollection } = await request(app)
      .get("/articles")
      .expect(200);
    expect(articleCollection).toEqual(
      expect.arrayContaining([
        expect.objectContaining(mockArticles[0]),
        expect.objectContaining(mockArticles[1])
      ])
    );

    Draft.find = origFunction;
  });

  it("GET /articles/:articleTitle should return the correct article", async () => {
    const { body: articleCollection } = await request(app)
      .get("/articles/asdefrrrrrr")
      .expect(200);
    expect(articleCollection[0].title).toEqual("asdefrrrrrr");
  });

  it("GET /articles/:articleTitle should return the right category", async () => {
    const { body: articleCollection } = await request(app)
      .get("/articles/asdefrrrrrr")
      .expect(200);
    expect(articleCollection.category).toEqual("lemonade");
  });

  it("PATCH /articles/update/:articleId should patch the correct article", async () => {
    const updatedArticle = {
      isPublished: false,
      _id: "5e660cefd4d9040017bc061e",
      title: "Nicholas hihi",
      topicAndSubtopicArray: [
        {
          blockArray: ["<p>Jon jon </p>"],
          _id: "5e660cefd4d9040017bc061f",
          title: "Nicholas hihi"
        },
        {
          blockArray: ["<p>;l'g;ldfkgl;dfkgl;dfkgl;dfkgl;dkg;</p>"],
          _id: "5e660cefd4d9040017bc0620",
          title: "mcncncncnc"
        }
      ],
      id: "411b3f25-f2b0-453e-8319-927590220ad0",
      __v: 0
    };
    const response = await request(app)
      .patch(`/articles/update/${updatedArticle.id}`)
      .send(updatedArticle)
      .expect(200);
    expect(response.body).toMatchObject(updatedArticle);
  });
  it("DELETE /:articleTitle should return ", async () => {
    const expectedData = {
      __v: 0,
      _id: "5e660cefd4d9040017bc061e",
      createdAt: "2020-03-09T09:31:27.519Z",
      id: "411b3f25-f2b0-453e-8319-927590220ad0",
      isPublished: false,
      title: "asdefrrrrrr",
      topicAndSubtopicArray: [
        {
          _id: "5e660cefd4d9040017bc061f",
          blockArray: ["<p>sdjkadjaksdjaskjdkasdj</p>"],
          title: "asdefrrrrrr"
        },
        {
          _id: "5e660cefd4d9040017bc0620",
          blockArray: ["<p>;l'g;ldfkgl;dfkgl;dfkgl;dfkgl;dkg;</p>"],
          title: "mcncncncnc"
        }
      ],
      updatedAt: "2020-03-09T09:31:27.519Z"
    };
    const { body: articleCollection } = await request(app)
      .delete(`/articles/asdefrrrrrr`)
      .expect(200);
    expect(articleCollection).toMatchObject(expectedData);
  });
});
