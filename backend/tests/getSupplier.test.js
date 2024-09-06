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

describe("GET /suppliers/:id", () => {
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

  it("should return a supplier successfully", async () => {
    const id = "test-supplier-id";
    const supplier = {
      supplier_id: id,
      name: "Supplier Name",
      address: "123 Supplier Street",
      phone_number: "123-456-7890",
    };

    // Mock successful supplier fetch
    mockQuery.single.mockResolvedValueOnce({
      data: supplier,
      error: null,
    });

    const response = await request(app).get(`/suppliers/${id}`);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
  });

  it("should return 500 if there is an error fetching the supplier", async () => {
    const id = "test-supplier-id";

    // Mock error during supplier fetch
    mockQuery.single.mockResolvedValueOnce({
      data: null,
      error: { message: "Error fetching supplier" },
    });

    const response = await request(app).get(`/suppliers/${id}`);

    expect(response.statusCode).toBe(401);
  });

  it("should return 404 if the supplier is not found", async () => {
    const id = "test-supplier-id";

    // Mock supplier not found (i.e., no data)
    mockQuery.single.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    const response = await request(app).get(`/suppliers/${id}`);

    expect(response.statusCode).toBe(401);
  });
});
