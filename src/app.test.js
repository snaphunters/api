const app = require("./app");
const request = require("supertest");

describe("app.js", () => {
  it("GET / should return status 200 and endpoints in a JSON file", async () => {
    const { body } = await request(app)
      .get("/")
      .expect(200);
    expect(body).toEqual({ 0: "GET /", 1: "POST /articles" });
  });
});
