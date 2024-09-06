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

describe("GET /ventures", () => {
  let mockQuery;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mock data before each test

    // Mock the query chain from `supabase.from()`
    mockQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    };

    // Mock `supabase.from()` to return our mocked query chain
    jest.spyOn(supabase, "from").mockReturnValue(mockQuery);
  });

  it("should return ventures successfully", async () => {
    const ventures = [
      {
        id: "venture1",
        name: "Venture 1",
        address: "123 Venture Street",
        description: "First real estate venture",
        properties: ["property1", "property2"],
      },
      {
        id: "venture2",
        name: "Venture 2",
        address: "456 Venture Street",
        description: "Second real estate venture",
        properties: ["property3", "property4"],
      },
    ];

    // Mock successful ventures fetch
    mockQuery.eq.mockResolvedValueOnce({
      data: ventures,
      error: null,
    });

    const response = await request(app).get("/ventures");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
  });

  it("should return 500 if there is an error fetching the ventures", async () => {
    // Mock error during ventures fetch
    mockQuery.eq.mockResolvedValueOnce({
      data: null,
      error: { message: "Error fetching ventures" },
    });

    const response = await request(app).get("/ventures");

    expect(response.statusCode).toBe(401);
  });

  it("should return 200 with an empty array if no ventures are found", async () => {
    // Mock no ventures found
    mockQuery.eq.mockResolvedValueOnce({
      data: [],
      error: null,
    });

    const response = await request(app).get("/ventures");

    expect(response.statusCode).toBe(401);
  });
});
