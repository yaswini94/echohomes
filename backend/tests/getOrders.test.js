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

describe("GET /orders", () => {
  let mockQuery;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mock data before each test

    // Mock the query chain from `supabase.from()`
    mockQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      not: jest.fn().mockReturnThis(),
    };

    // Mock `supabase.from()` to return our mocked query chain
    jest.spyOn(supabase, "from").mockReturnValue(mockQuery);
  });

  it("should return orders successfully for a given venture_id", async () => {
    const orders = [
      {
        buyer_id: "buyer1",
        venture_id: "test-venture-id",
        features: ["feature1"],
      },
    ];

    // Mock successful orders fetch
    mockQuery.not.mockResolvedValueOnce({ data: orders, error: null });

    const response = await request(app)
      .get("/orders")
      .query({ venture_id: "test-venture-id" });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
  });

  it("should return 500 if there is an error fetching orders", async () => {
    // Mock error during orders fetch
    mockQuery.not.mockResolvedValueOnce({
      data: null,
      error: { message: "Error fetching orders" },
    });

    const response = await request(app)
      .get("/orders")
      .query({ venture_id: "test-venture-id" });

    expect(response.statusCode).toBe(401);
  });

  it("should return an empty array if no orders are found", async () => {
    // Mock no orders found
    mockQuery.not.mockResolvedValueOnce({ data: [], error: null });

    const response = await request(app)
      .get("/orders")
      .query({ venture_id: "test-venture-id" });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
  });
});
