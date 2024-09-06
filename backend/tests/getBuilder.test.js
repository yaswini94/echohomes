const request = require("supertest");
const express = require("express");
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Create an express app and inject the route for testing
const app = express();
app.use(express.json()); // to parse JSON body

// Mock the authenticateToken middleware inline
app.use((req, res, next) => {
  req.user = { id: "test-builder-id" }; // Mocked user object
  next();
});

// Inject the route you want to test
app.get("/builders/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("builders")
    .select("*")
    .eq("builder_id", id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Mock Supabase clients in the test
jest.mock("@supabase/supabase-js", () => {
  const mockFrom = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  };

  return {
    createClient: jest.fn().mockReturnValue({
      from: jest.fn(() => mockFrom),
    }),
  };
});

// Tests for /builders/:id endpoint
describe("GET /builders/:id", () => {
  let mockSupabase;

  beforeEach(() => {
    mockSupabase = createClient();
    jest.clearAllMocks();
  });

  it("should successfully fetch the builder by ID", async () => {
    const builderId = "test-builder-id";

    // Mock Supabase response for fetching builder
    mockSupabase.from().single.mockResolvedValueOnce({
      data: {
        builder_id: "test-builder-id",
        name: "Test Builder",
        contact_email: "test@example.com",
      },
      error: null,
    });

    const response = await request(app).get(`/builders/${builderId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("builder_id", "test-builder-id");
    expect(response.body).toHaveProperty("name", "Test Builder");
    expect(response.body).toHaveProperty("contact_email", "test@example.com");
  });

  it("should return 500 if there is an error fetching the builder", async () => {
    const builderId = "test-builder-id";

    // Mock Supabase error for fetching builder
    mockSupabase.from().single.mockResolvedValueOnce({
      data: null,
      error: { message: "Builder not found" },
    });

    const response = await request(app).get(`/builders/${builderId}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("error", "Builder not found");
  });
});
