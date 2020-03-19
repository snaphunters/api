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
        name: "Getting Started",
        topicIdArray: [
          "49c6a924-5ddb-4939-ab88-e941aee93485",
          "30d6cd29-155f-4f51-af53-985a2bb32425"
        ]
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
    expect(response.body).toEqual(["lemonade", "Getting Started"]);
  });
  it("GET /categories/:name should return 200 and a list of all the topics in the category", async () => {
    const response = await request(app).get("/categories/Getting Started");
    expect(response.body).toEqual([
      "49c6a924-5ddb-4939-ab88-e941aee93485",
      "30d6cd29-155f-4f51-af53-985a2bb32425"
    ]);
  });
});
