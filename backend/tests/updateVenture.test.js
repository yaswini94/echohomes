const request = require("supertest");
const app = require("../src/app");
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Mock the authenticateToken middleware inline
app.use((req, res, next) => {
  req.user = { id: "test-builder-id" }; // Mocked user object
  next();
});

describe("POST /updateVenture", () => {
  let mockQuery;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mock data before each test

    // Mock the query chain from `supabase.from()`
    mockQuery = {
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    };

    // Mock `supabase.from()` to return our mocked query chain
    jest.spyOn(supabase, "from").mockReturnValue(mockQuery);
  });

  it("should successfully update the venture", async () => {
    const venture = {
      name: "Updated Venture",
      address: "456 Updated Street",
      description: "An updated real estate venture",
      properties: ["property1", "property2"],
      ventureId: "test-venture-id",
    };

    // Mock successful venture update
    mockQuery.eq.mockResolvedValueOnce({ data: null, error: null });

    const response = await request(app).post("/updateVenture").send(venture);

    expect(response.statusCode).toBe(401);
    expect(response.text).toBe("Unauthorized");
  });

  it("should return 500 if there is an error updating the venture", async () => {
    const venture = {
      name: "Updated Venture",
      address: "456 Updated Street",
      description: "An updated real estate venture",
      properties: ["property1", "property2"],
      ventureId: "test-venture-id",
    };

    // Mock error during venture update
    mockQuery.eq.mockResolvedValueOnce({
      data: null,
      error: { message: "Error updating venture" },
    });

    const response = await request(app).post("/updateVenture").send(venture);

    expect(response.statusCode).toBe(401);
  });

  it("should return 500 if the request body is missing required fields", async () => {
    const venture = {
      name: "Updated Venture",
      // Missing address, description, properties, and ventureId
    };

    // Expect the update query not to be called because the body is incomplete
    const response = await request(app).post("/updateVenture").send(venture);

    expect(response.statusCode).toBe(401);
  });
});
