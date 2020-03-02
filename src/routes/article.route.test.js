const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Article = require("../models/article.model");
const app = require("../app");

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

  afterAll(async mongoServer => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Article.create();
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await Article.deleteMany();
  });

  it("should return 1 when 1", () => {
    expect(1).toBe(1);
  });
});
