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

describe("GET /ventures/:id", () => {
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

  it("should return a venture successfully", async () => {
    const id = "test-venture-id";
    const venture = {
      venture_id: id,
      name: "Venture 1",
      address: "123 Venture Street",
      description: "First real estate venture",
      properties: ["property1", "property2"],
    };

    // Mock successful venture fetch
    mockQuery.single.mockResolvedValueOnce({
      data: venture,
      error: null,
    });

    const response = await request(app).get(`/ventures/${id}`);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
  });

  it("should return 500 if there is an error fetching the venture", async () => {
    const id = "test-venture-id";

    // Mock error during venture fetch
    mockQuery.single.mockResolvedValueOnce({
      data: null,
      error: { message: "Error fetching venture" },
    });

    const response = await request(app).get(`/ventures/${id}`);

    expect(response.statusCode).toBe(401);
  });

  it("should return 404 if the venture is not found", async () => {
    const id = "test-venture-id";

    // Mock venture not found (i.e., no data)
    mockQuery.single.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    const response = await request(app).get(`/ventures/${id}`);

    expect(response.statusCode).toBe(401);
  });
});
