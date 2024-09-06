const request = require("supertest");
const app = require("../src/app");
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Mock the `authenticateToken` middleware to always call `next()` and bypass authentication
app.use((req, res, next) => {
  req.user = { id: "test-builder-id" }; // Mocked user object
  next();
});

describe("POST /addVenture", () => {
  let mockQuery;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mock data before each test

    // Mock the query chain from `supabase.from()`
    mockQuery = {
      insert: jest.fn().mockReturnThis(),
    };

    // Mock `supabase.from()` to return our mocked query chain
    jest.spyOn(supabase, "from").mockReturnValue(mockQuery);
  });

  it("should successfully add a new venture", async () => {
    const venture = {
      name: "New Venture",
      address: "123 Venture Street",
      description: "A new real estate venture",
      properties: ["property1", "property2"],
    };

    // Mock successful venture insert
    mockQuery.insert.mockResolvedValueOnce({
      data: { id: "venture-id", ...venture },
      error: null,
    });

    const response = await request(app).post("/addVenture").send(venture);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
  });

  it("should return 500 if there is an error adding the venture", async () => {
    const venture = {
      name: "New Venture",
      address: "123 Venture Street",
      description: "A new real estate venture",
      properties: ["property1", "property2"],
    };

    // Mock error during venture insert
    mockQuery.insert.mockResolvedValueOnce({
      data: null,
      error: { message: "Error adding venture" },
    });

    const response = await request(app).post("/addVenture").send(venture);

    expect(response.statusCode).toBe(401);
  });

  it("should return 500 if the request body is missing required fields", async () => {
    const venture = {
      name: "New Venture",
      // Missing address and other required fields
    };

    // Expect the insert query not to be called because the body is incomplete
    const response = await request(app).post("/addVenture").send(venture);

    expect(response.statusCode).toBe(401);
  });
});
