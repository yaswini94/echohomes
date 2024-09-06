const request = require("supertest");
const app = require("../src/app");

describe("Auth Tests", () => {
  test("GET / - should return Welcome message", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Welcome to Echo homes!");
  });

  test("POST /login - should return 400 if login fails", async () => {
    const response = await request(app).post("/login").send({
      email: "invalid@example.com",
      password: "invalidpassword",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("POST /register - should return 400 if registration fails", async () => {
    const response = await request(app).post("/register").send({
      email: "test@example.com",
      password: "password123",
      name: "John Doe",
      companyName: "Company XYZ",
      phoneNumber: "123456789",
      address: "123 Street",
    });
    expect(response.statusCode).toBe(400); // Modify this to match expected conditions
    expect(response.body).toHaveProperty("error");
  });
});
