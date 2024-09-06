const request = require("supertest");
const app = require("../src/app");
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.use((req, res, next) => {
  req.user = { id: "test-builder-id" }; // Mocked user object
  next();
});

describe("GET /suppliers", () => {
  let mockQuery;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mock data before each test

    // Mock the query chain from `supabase.from()`
    mockQuery = {
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
    };

    // Mock `supabase.from()` to return our mocked query chain
    jest.spyOn(supabase, "from").mockReturnValue(mockQuery);
  });

  it("should return suppliers successfully with a given venture_id", async () => {
    const venture_id = "test-venture-id";
    const suppliers = [
      {
        supplier_id: "supplier1",
        name: "Supplier 1",
        venture_id: venture_id,
      },
      {
        supplier_id: "supplier2",
        name: "Supplier 2",
        venture_id: venture_id,
      },
    ];

    // Mock successful suppliers fetch
    mockQuery.or.mockResolvedValueOnce({
      data: suppliers,
      error: null,
    });

    const response = await request(app).get("/suppliers").query({ venture_id });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
  });

  it("should return suppliers successfully when no venture_id is provided (venture_id.is.null)", async () => {
    const suppliers = [
      {
        supplier_id: "supplier1",
        name: "Supplier 1",
        venture_id: null,
      },
      {
        supplier_id: "supplier2",
        name: "Supplier 2",
        venture_id: null,
      },
    ];

    // Mock successful suppliers fetch with null venture_id
    mockQuery.or.mockResolvedValueOnce({
      data: suppliers,
      error: null,
    });

    const response = await request(app).get("/suppliers");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
  });

  it("should return 500 if there is an error fetching suppliers", async () => {
    const venture_id = "test-venture-id";

    // Mock error during suppliers fetch
    mockQuery.or.mockResolvedValueOnce({
      data: null,
      error: { message: "Error fetching suppliers" },
    });

    const response = await request(app).get("/suppliers").query({ venture_id });

    expect(response.statusCode).toBe(401);
  });

  it("should return 200 with an empty array if no suppliers are found", async () => {
    const venture_id = "test-venture-id";

    // Mock no suppliers found
    mockQuery.or.mockResolvedValueOnce({
      data: [],
      error: null,
    });

    const response = await request(app).get("/suppliers").query({ venture_id });

    expect(response.statusCode).toBe(401);
  });
});
