const request = require("supertest");
const app = require("../src/app");
const { createClient } = require("@supabase/supabase-js");
const stripe = require("stripe");

jest.mock("@supabase/supabase-js", () => {
  return {
    createClient: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      update: jest.fn().mockReturnThis(), // Ensure update() is chainable
    }),
  };
});

jest.mock("stripe", () => {
  return jest.fn().mockReturnValue({
    customers: {
      create: jest.fn(),
    },
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
  });
});

describe("POST /create-checkout-session", () => {
  let mockSupabase;
  let mockStripe;

  // Mock console.error to prevent logging in the test output
  const originalConsoleError = console.error;
  beforeEach(() => {
    console.error = jest.fn(); // Mock console.error
    mockSupabase = createClient();
    mockStripe = stripe();
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error = originalConsoleError; // Restore console.error after each test
  });

  it("should create a checkout session successfully", async () => {
    const buyer_id = "test-buyer-id";
    const features = {
      choices: {
        choice1: { name: "Choice 1", id: "choice1", price: 1000, quantity: 1 },
      },
      extras: {
        extra1: { name: "Extra 1", id: "extra1", price: 500, quantity: 1 },
      },
    };

    mockSupabase.single.mockResolvedValueOnce({
      data: {
        buyer_id,
        contact_email: "test@example.com",
        stripe_customer_id: null,
      },
      error: null,
    });

    mockStripe.customers.create.mockResolvedValueOnce({
      id: "new-customer-id",
    });

    mockSupabase.update.mockReturnThis();
    mockSupabase.eq.mockReturnThis();

    mockStripe.checkout.sessions.create.mockResolvedValueOnce({
      id: "session-id",
    });

    const response = await request(app)
      .post("/create-checkout-session")
      .send({ features, buyer_id });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", "session-id");
  });

  it("should return 500 if there is an error fetching the user", async () => {
    const buyer_id = "test-buyer-id";
    const features = {};

    mockSupabase.single.mockResolvedValueOnce({
      data: null,
      error: { message: "User not found" },
    });

    const response = await request(app)
      .post("/create-checkout-session")
      .send({ features, buyer_id });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("error", "User not found");
  });

  it("should return 500 if there is an error creating a Stripe customer", async () => {
    const buyer_id = "test-buyer-id";
    const features = {
      choices: {
        choice1: { name: "Choice 1", id: "choice1", price: 1000, quantity: 1 },
      },
      extras: {
        extra1: { name: "Extra 1", id: "extra1", price: 500, quantity: 1 },
      },
    };

    mockSupabase.single.mockResolvedValueOnce({
      data: {
        buyer_id,
        contact_email: "test@example.com",
        stripe_customer_id: null,
      },
      error: null,
    });

    mockStripe.customers.create.mockRejectedValueOnce(
      new Error("Stripe error")
    );

    const response = await request(app)
      .post("/create-checkout-session")
      .send({ features, buyer_id });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("error", "Stripe error");
  });

  it("should return 500 if there is an error creating the checkout session", async () => {
    const buyer_id = "test-buyer-id";
    const features = {
      choices: {
        choice1: { name: "Choice 1", id: "choice1", price: 1000, quantity: 1 },
      },
      extras: {
        extra1: { name: "Extra 1", id: "extra1", price: 500, quantity: 1 },
      },
    };

    mockSupabase.single.mockResolvedValueOnce({
      data: {
        buyer_id,
        contact_email: "test@example.com",
        stripe_customer_id: null,
      },
      error: null,
    });

    mockStripe.customers.create.mockResolvedValueOnce({
      id: "new-customer-id",
    });

    mockSupabase.update.mockReturnThis();
    mockSupabase.eq.mockReturnThis();

    mockStripe.checkout.sessions.create.mockRejectedValueOnce(
      new Error("Session error")
    );

    const response = await request(app)
      .post("/create-checkout-session")
      .send({ features, buyer_id });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("error", "Session error");
  });
});
