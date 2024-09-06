const request = require("supertest");
const { createClient } = require("@supabase/supabase-js");
const app = require("../src/app");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Mock middleware function
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    return res.sendStatus(403); // Forbidden
  }
  const { user } = data;
  req.user = user;
  next();
};

// Setup a mock route to test the middleware
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

// Unit tests for the middleware
describe("authenticateToken Middleware", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/protected");
    expect(response.statusCode).toBe(401);
  });

  test("should return 403 if token is invalid", async () => {
    // Mocking Supabase response for invalid token
    supabase.auth.getUser = jest.fn().mockResolvedValue({
      data: null,
      error: new Error("Invalid token"),
    });

    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalidtoken");

    expect(response.statusCode).toBe(403);
  });

  test("should call next() if token is valid", async () => {
    // Mocking Supabase response for valid token
    supabase.auth.getUser = jest.fn().mockResolvedValue({
      data: { user: { id: "123", email: "test@example.com" } },
      error: null,
    });

    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer validtoken");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Protected route accessed");
    expect(response.body.user).toHaveProperty("id", "123");
    expect(response.body.user).toHaveProperty("email", "test@example.com");
  });
});
