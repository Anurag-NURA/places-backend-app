import request from "supertest";
import app from "../src/app.ts";

describe("Test the route path", () => {
  it("should respond to the GET method on /api", async () => {
    const response = await request(app).get("/api");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "Welcome to YourPlaces API",
      routes: {
        users: "/api/users",
        places: "/api/places",
      },
    });
  });
});
