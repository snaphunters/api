const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Category = require("../models/category.model");
const { Publish } = require("../models/article.model");
const app = require("../app");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("publish.route.js", () => {
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
    await Publish.create(mockArticle);
    await Category.create({
      name: mockArticle.category
    });
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await Publish.deleteMany();
    await Category.deleteMany();
  });

  it("POST /publish should return message 201 created and the article posted", async () => {
    const mockArticle = {
      title: "This is the test published article",
      id: "411b3f25-f2b0-453e-8319-827590220ad0"
    };
    const { body } = await request(app)
      .post("/publish")
      .send(mockArticle)
      .expect(201);
    expect(body).toMatchObject(mockArticle);
  });
  it("POST /publish with categories that are already in the DB should return message 201 created and the article posted", async () => {
    const mockArticle = {
      title: "This is the test article",
      id: "411b3f25-f2b0-453e-8319-727590220ad0",
      category: "lemonade"
    };
    const { body } = await request(app)
      .post("/publish")
      .send(mockArticle)
      .expect(201);
    expect(body).toMatchObject(mockArticle);
  });

  it("POST / should return message 400 as validation error when title is not given", async () => {
    const mockArticle = {};
    const { body: err } = await request(app)
      .post("/publish")
      .send(mockArticle)
      .expect(400);
    expect(err).toEqual({
      error:
        "Publish validation failed: title: Path `title` is required., id: Path `id` is required."
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
      .post("/publish")
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
    const origFunction = Publish.init;
    Publish.init = jest.fn();
    Publish.init.mockImplementationOnce(() => {
      throw new Error();
    });
    const { body: err } = await request(app)
      .post("/publish")
      .send(mockArticle)
      .expect(500);
    expect(err).toEqual({
      error: "Internal server error."
    });
    Publish.init = origFunction;
  });
  it("GET /publish should return message 200 ok and all the articles posted", async () => {
    const mockArticles = [
      {
        title: "This is article one"
      },
      {
        title: "This is article two"
      }
    ];
    const origFunction = Publish.find;
    Publish.find = jest.fn();
    Publish.find.mockImplementationOnce(() => {
      return mockArticles;
    });
    const { body: articleCollection } = await request(app)
      .get("/publish")
      .expect(200);
    expect(articleCollection).toEqual(
      expect.arrayContaining([
        expect.objectContaining(mockArticles[0]),
        expect.objectContaining(mockArticles[1])
      ])
    );

    Publish.find = origFunction;
  });
  it("GET /publish/:articleId should get by id with 200 ok", async () => {
    const mockArticles = [
      {
        title: "This is article one",
        id: "411b3f25-f2b0-453e-8319-927590220ad0"
      }
    ];
    const origFunction = Publish.find;
    Publish.find = jest.fn();
    Publish.find.mockImplementationOnce(() => {
      return mockArticles;
    });
    const { body: articleCollection } = await request(app)
      .get(`/publish/${mockArticles.id}`)
      .expect(200);
    expect(articleCollection).toEqual(
      expect.arrayContaining([expect.objectContaining(mockArticles[0])])
    );

    Publish.find = origFunction;
  });
  it("PATCH should update current published article with newly-edited version", async () => {
    const updatedArticle = {
      isPublished: false,
      _id: "5e660cefd4d9040017bc061e",
      title: "Super Duper",
      topicAndSubtopicArray: [
        {
          blockArray: ["<p>Hungry bunny</p>"],
          _id: "5e660cefd4d9040017bc061f",
          title: "Mama Lemon"
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
      .patch(`/publish/update/${updatedArticle.id}`)
      .send(updatedArticle)
      .expect(200);
    expect(response.body).toMatchObject(updatedArticle);
  });
});
