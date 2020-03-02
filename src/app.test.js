const app = require("./app");
const request = require("supertest");

describe("app.js", () => {
  it("should return 1 when 1", () => {
    expect(1).toBe(1);
  });
  it(`GET / should return status 200 and "Hello"`, async () => {
    const { body } = await request(app)
      .get("/")
      .expect(200);
    expect(body).toEqual({ 0: "GET /", 1: "POST /articles" });
  });
});
