const request = require("supertest");
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const stripe = require("stripe");

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
app.post("/create-builder-supplier-checkout-session", async (req, res) => {
  const { orders = [], supplier_id } = req.body;
  const builder = req.user;

  try {
    const { data: user, error: userError } = await supabase
      .from("builders")
      .select("builder_id, contact_email, stripe_customer_id")
      .eq("builder_id", builder.id)
      .single();

    if (userError) {
      return res.status(500).json({ error: userError.message });
    }

    let customerId;

    if (user?.stripe_customer_id) {
      customerId = user.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.contact_email,
      });
      customerId = customer.id;

      const { error: updateError } = await supabase
        .from("builders")
        .update({ stripe_customer_id: customerId })
        .eq("builder_id", user.builder_id);

      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }
    }

    const line_items = orders.map((order) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: order.name,
        },
        unit_amount: order.price * 100,
      },
      quantity: order.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      invoice_creation: { enabled: true },
      client_reference_id: `builder=${builder.id}__supplier=${supplier_id}`,
      metadata: {
        userId: `builder=${builder.id}__supplier=${supplier_id}`,
      },
      success_url: `${process.env.FRONTEND_URL}/orders?tab=suppliers&status=success`,
      cancel_url: `${process.env.FRONTEND_URL}/orders?tab=suppliers&status=cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

// Mock Supabase and Stripe clients in the test
jest.mock("@supabase/supabase-js", () => {
  const mockFrom = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
  };

  return {
    createClient: jest.fn().mockReturnValue({
      from: jest.fn(() => mockFrom),
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

// Tests for create-builder-supplier-checkout-session endpoint
describe("POST /create-builder-supplier-checkout-session", () => {
  let mockSupabase;
  let mockStripe;

  // Mock console.error to prevent logging in the test output
  const originalConsoleError = console.error;
  beforeEach(() => {
    console.error = jest.fn(); // Mock console.error
    mockStripe = stripe();
    mockSupabase = createClient();
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error = originalConsoleError; // Restore console.error after each test
  });

  it("should return 500 if there is an error fetching the builder", async () => {
    const orders = [];
    const supplier_id = "test-supplier-id";

    // Mock Supabase error for fetching builder
    mockSupabase.from().single.mockResolvedValueOnce({
      data: null,
      error: { message: "Builder not found" },
    });

    const response = await request(app)
      .post("/create-builder-supplier-checkout-session")
      .send({ orders, supplier_id });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("error", "Builder not found");
  });
});
