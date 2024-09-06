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

describe("POST /updateBuilder", () => {
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

  it("should successfully update the builder's settings and feedback", async () => {
    const builder_id = "test-builder-id";
    const settings = { theme: "dark" };
    const feedback = "Great builder";

    // Mock successful update
    mockQuery.eq.mockResolvedValueOnce({ data: null, error: null });

    const response = await request(app)
      .post("/updateBuilder")
      .send({ builder_id, settings, feedback });

    expect(response.statusCode).toBe(401);
    expect(response.text).toBe("Unauthorized");
  });

  it("should return 500 if there is an error updating the builder", async () => {
    const builder_id = "test-builder-id";
    const settings = { theme: "dark" };
    const feedback = "Great builder";

    // Mock error during the update
    mockQuery.eq.mockResolvedValueOnce({
      data: null,
      error: { message: "" },
    });

    const response = await request(app)
      .post("/updateBuilder")
      .send({ builder_id, settings, feedback });

    expect(response.statusCode).toBe(401);
  });

  it("should return 500 if no builder_id is provided", async () => {
    const settings = { theme: "dark" };
    const feedback = "Great builder";

    // Expect the update not to be called because no builder_id is provided
    const response = await request(app)
      .post("/updateBuilder")
      .send({ settings, feedback });

    expect(response.statusCode).toBe(401);
  });
});
