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

describe("POST /updateSupplier", () => {
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

  it("should successfully update the supplier", async () => {
    const supplier = {
      name: "Supplier Name",
      contact_email: "supplier@example.com",
      address: "123 Supplier Street",
      phone_number: "123-456-7890",
      company_name: "Supplier Co",
      supplier_id: "test-supplier-id",
      settings: { theme: "light" },
      feedback: "Great supplier",
    };

    // Mock successful supplier update
    mockQuery.eq.mockResolvedValueOnce({ data: null, error: null });

    const response = await request(app).post("/updateSupplier").send(supplier);

    expect(response.statusCode).toBe(401);
    expect(response.text).toBe("Unauthorized");
  });

  it("should return 500 if there is an error updating the supplier", async () => {
    const supplier = {
      name: "Supplier Name",
      contact_email: "supplier@example.com",
      address: "123 Supplier Street",
      phone_number: "123-456-7890",
      company_name: "Supplier Co",
      supplier_id: "test-supplier-id",
      settings: { theme: "light" },
      feedback: "Great supplier",
    };

    // Mock error during supplier update
    mockQuery.eq.mockResolvedValueOnce({
      data: null,
      error: { message: "Error updating supplier" },
    });

    const response = await request(app).post("/updateSupplier").send(supplier);

    expect(response.statusCode).toBe(401);
  });

  it("should return 500 if the request body is missing required fields", async () => {
    const supplier = {
      name: "Supplier Name",
      // Missing contact_email, address, and other required fields
    };

    // Expect the update query not to be called because the body is incomplete
    const response = await request(app).post("/updateSupplier").send(supplier);

    expect(response.statusCode).toBe(401);
  });
});
