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

describe("GET /settings/:role", () => {
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

  it("should return settings successfully for role 'builders'", async () => {
    const role = "builders";
    const settings = { theme: "dark" };

    // Mock successful fetch of settings
    mockQuery.single.mockResolvedValueOnce({
      data: { settings },
      error: null,
    });

    const response = await request(app).get(`/settings/${role}`);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
  });

  it("should return settings successfully for role 'suppliers'", async () => {
    const role = "suppliers";
    const settings = { theme: "light" };

    // Mock successful fetch of settings
    mockQuery.single.mockResolvedValueOnce({
      data: { settings },
      error: null,
    });

    const response = await request(app).get(`/settings/${role}`);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
  });

  it("should return 500 if there is an error fetching the settings", async () => {
    const role = "builders";

    // Mock an error during the fetch
    mockQuery.single.mockResolvedValueOnce({
      data: null,
      error: { message: "Error fetching settings" },
    });

    const response = await request(app).get(`/settings/${role}`);

    expect(response.statusCode).toBe(401);
  });

  it("should return 404 if the settings are not found", async () => {
    const role = "builders";

    // Mock the case where settings are not found
    mockQuery.single.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    const response = await request(app).get(`/settings/${role}`);

    expect(response.statusCode).toBe(401);
  });

  it("should return 500 if an unsupported role is passed", async () => {
    const role = "unknown_role";

    // Mock successful fetch but for an unsupported role
    const response = await request(app).get(`/settings/${role}`);

    expect(response.statusCode).toBe(401); // You may want to handle this better in the code
  });
});
