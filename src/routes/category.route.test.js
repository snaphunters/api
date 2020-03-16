const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Category = require("../models/category.model");
const app = require("../app");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("category.route.js", () => {
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
    const mockCategory = [
      {
        name: "lemonade"
      },
      {
        name: "lemonade2"
      }
    ];
    await Category.create(mockCategory);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await Category.deleteMany();
  });
  it("GET /categories should return 200 and a list of all the categories", async () => {
    const response = await request(app).get("/categories");
    expect(response.body).toEqual(["lemonade", "lemonade2"]);
  });
});
