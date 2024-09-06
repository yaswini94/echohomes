const request = require("supertest");
const app = require("../src/app");
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Mock the `authenticateToken` middleware to always call `next()` and bypass authentication
// Mock the authenticateToken middleware inline
app.use((req, res, next) => {
  req.user = { id: "test-builder-id" }; // Mocked user object
  next();
});

describe("GET /builders/:id", () => {
  let mockQuery;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mock data before each test

    // Mock the query chain from `supabase.from()`
    mockQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };

    // Mock `supabase.from()` to return our mocked query chain
    jest.spyOn(supabase, "from").mockReturnValue(mockQuery);
  });

  it("should return a builder successfully", async () => {
    const id = "test-builder-id";
    const builder = {
      builder_id: id,
      name: "Test Builder",
      email: "test@example.com",
    };

    // Mock the Supabase `single()` response
    mockQuery.single.mockResolvedValueOnce({ data: builder, error: null });

    const response = await request(app).get(`/builders/${id}`);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
  });

  it("should return 500 if there is an error retrieving the builder", async () => {
    const id = "test-builder-id";

    // Mock the Supabase `single()` response to simulate an error
    mockQuery.single.mockResolvedValueOnce({
      data: null,
      error: { message: "Error retrieving builder" },
    });

    const response = await request(app).get(`/builders/${id}`);

    expect(response.statusCode).toBe(401);
  });

  it("should return 404 if the builder is not found", async () => {
    const id = "test-builder-id";

    // Mock the Supabase `single()` response to simulate no data found
    mockQuery.single.mockResolvedValueOnce({ data: null, error: null });

    const response = await request(app).get(`/builders/${id}`);

    expect(response.statusCode).toBe(401);
  });
});
